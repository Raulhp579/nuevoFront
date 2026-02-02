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
import { interval } from 'rxjs';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { MapaComponent } from '../mapa/mapa.component';
import { TimeEntrieService } from '../../services/time-entrie-service';

@Component({
  selector: 'app-home',
  imports: [MatIconModule, DatePipe, MapaComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  constructor(private cdr: ChangeDetectorRef, private timeEntireService:TimeEntrieService) {}

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

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedStartTime = localStorage.getItem('timerStartTime');
      if (savedStartTime) {
        this.startTime = parseInt(savedStartTime, 10);
        this.working = true;
        this.startTimer();
      }
      const savedInfoTime = localStorage.getItem('infoTime');
      if (savedInfoTime) {
        this.infoTime = savedInfoTime;
      }
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startTimer() {
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
    this.working = !this.working;

    if (this.working) {
      this.startTime = Date.now();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('timerStartTime', this.startTime.toString());
      }
      this.startTimer();
    } else {
      clearInterval(this.intervalId);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('timerStartTime');
      }
      this.startTime = null;
      this.sec = 0;
      this.min = 0;
      this.hour = 0;
    }

    this.timeInOut();

    this.registerTime()
  }

  infoTime: string = '00h 00m';

  timeInOut() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    this.infoTime = `${h}h ${m}min`;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('infoTime', this.infoTime);
    }
  }

  registerTime(){
    this.timeEntireService.createWithAuth().subscribe(respose=>{
      console.log(respose)
    })
  }
}
