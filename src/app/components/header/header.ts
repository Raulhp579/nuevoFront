import { Component, EventEmitter, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Output() toggleSidenav = new EventEmitter<void>();

  onToggle() {
    this.toggleSidenav.emit();
  }
}
