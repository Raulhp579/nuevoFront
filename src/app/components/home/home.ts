import {
  Component,
  effect,
  signal,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom, interval } from 'rxjs';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { MapaComponent } from '../mapa/mapa.component';
import { TimeEntrieService } from '../../services/time-entrie-service';
import { UserService } from '../../services/user-service';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatIconModule, DatePipe, MapaComponent, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  constructor(
    private cdr: ChangeDetectorRef,
    private timeEntireService: TimeEntrieService,
    private userService: UserService,
  ) {}

  date = new Date();
  currentTime = signal<Date>(new Date());

  updateTime = effect(() => {
    interval(1000).subscribe(() => {
      this.currentTime.set(new Date());
    });
  });

  working = false;
  sec = 0;
  min = 0;
  hour = 0;
  private intervalId: any;
  private startTime: number | null = null;

  get timerDisplay(): string {
    const h = this.hour.toString().padStart(2, '0');
    const m = this.min.toString().padStart(2, '0');
    const s = this.sec.toString().padStart(2, '0');
    return `${h}h ${m}m ${s}s`;
  }

  lastEntries = signal<any[]>([]);

  async ngOnInit() {
    this.getLastEntries();
  }

  getLastEntries() {
    this.timeEntireService.take3().subscribe(
      (response) => {
        this.lastEntries.set(response);
        this.updateStateFromEntries(response);
      },
      (error) => {
        console.error('Error fetching time entries', error);
      },
    );
  }

  updateStateFromEntries(entries: any[]) {
    if (entries.length > 0) {
      const latest = entries[0];
      // Si clock_out_at es nulo, significa que está trabajando
      if (!latest.clock_out_at) {
        this.working = true;
        this.startTime = new Date(latest.clock_in_at).getTime();
        this.infoTime = this.formatTime(new Date(latest.clock_in_at));
        this.startTimer();
      } else {
        this.working = false;
        this.startTime = null;
        this.stopTimer();
        // Mostrar hora de salida del último fichaje
        this.infoTime = this.formatTime(new Date(latest.clock_out_at));
      }
    } else {
      this.working = false;
      this.infoTime = '00h 00m';
    }
  }

  formatTime(date: Date): string {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}h ${m}min`;
  }

  calculateDuration(start: string, end: string): string {
    if (!start || !end) return '-';

    const startDate = new Date(start);
    const endDate = new Date(end);

    const diffMs = endDate.getTime() - startDate.getTime();
    if (diffMs < 0) return '-';

    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);

    return `${diffHrs}h ${diffMins}m`;
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  private stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.hour = 0;
    this.min = 0;
    this.sec = 0;
  }

  private startTimer() {
    this.stopTimer(); // Ensure no duplicate intervals
    this.intervalId = setInterval(() => {
      if (this.startTime) {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.hour = Math.floor(elapsed / 3600);
        this.min = Math.floor((elapsed % 3600) / 60);
        this.sec = elapsed % 60;
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  inOut() {
    // Optimistic UI update or just wait for response?
    // waiting for response is safer for consistency
    this.registerTime();
  }

  infoTime: string = '00h 00m';

  // timeInOut removed as logic is now central via updateStateFromEntries

  loading = signal<boolean>(false);

  registerTime() {
    if (this.loading()) return;
    this.loading.set(true);

    this.takeLocation()
      .then((location) => {
        if (!location) {
          alert('No se pudo obtener la ubicación. Asegúrate de tener el GPS activado.');
          this.loading.set(false);
          return;
        }

        const medacLat = 37.8802566;
        const medacLon = -4.8040947;
        const distance = this.calculateDistance(
          location.latitud,
          location.altitud,
          medacLat,
          medacLon,
        );

        if (distance > 0.2) {
          alert('No puedes fichar: Estás a más de 200 metros de tu puesto de trabajo.');
          this.loading.set(false);
          return;
        }

        this.timeEntireService.createWithAuth(location).subscribe(
          (response) => {
            console.log(response);
            this.getLastEntries(); // This will trigger updateStateFromEntries
            this.loading.set(false);
          },
          (error) => {
            console.error('Error registering time:', error);
            if (error.error && error.error.error) {
              alert(error.error.error); // Show backend error message to user
            }
            this.loading.set(false);
          },
        );
      })
      .catch(() => {
        this.loading.set(false);
      });
  }

  takeLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitud: position.coords.latitude,
              altitud: position.coords.longitude,
            };
            resolve(location);
          },
          (error) => {
            console.log(`Error al obtener la ubicacion: ${error.message}`);
            // Resolve with null so the backend can handle the error or validate
            resolve(null);
          },
          { enableHighAccuracy: false, timeout: 3000, maximumAge: 10000 },
        );
      } else {
        console.log('la localizacion no es soportada por el navegador');
        resolve(null);
      }
    });
  }

  // Haversine formula to calculate distance in km
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
