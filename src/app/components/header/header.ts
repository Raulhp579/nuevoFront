import { Component, EventEmitter, Output, inject, signal, OnInit } from '@angular/core';
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
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  @Output() toggleSidenav = new EventEmitter<void>();
  private userService = inject(UserService);
  user = signal<any>(null);

  async ngOnInit() {
    const userData = await firstValueFrom(this.userService.userInfo());
    this.user.set(userData);
  }

  onToggle() {
    this.toggleSidenav.emit();
  }
}
