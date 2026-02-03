import { Component, EventEmitter, Output, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterLink, DatePipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  @Output() toggleSidenav = new EventEmitter<void>();
  private userService = inject(UserService);
  user = signal<any>(null);

  // Señal para la hora actual
  currentTime = signal(new Date());
  private intervalId: any;

  async ngOnInit() {
    // Info usuario
    try {
      const userData = await firstValueFrom(this.userService.userInfo());
      this.user.set(userData);
    } catch (error) {
      console.error(error);
    }

    // Actualizar reloj cada segundo
    this.intervalId = setInterval(() => {
      this.currentTime.set(new Date());
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  onToggle() {
    this.toggleSidenav.emit();
  }
}
