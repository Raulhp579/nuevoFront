import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, RouterOutlet, RouterLink, RouterLinkActive, MatSidenavModule, MatListModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('nuevoFront');
}
