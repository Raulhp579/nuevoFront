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

@Component({
  selector: 'app-home',
  imports: [MatIconModule, DatePipe, MapaComponent],
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

  registerTime() {
    this.timeEntireService.createWithAuth().subscribe((respose) => {
      console.log(respose);
      this.getLastEntries(); // This will trigger updateStateFromEntries
    });
  }
}
