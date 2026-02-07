import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Header } from './components/header/header';
import { filter } from 'rxjs/operators';

import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Header,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('nuevoFront');
  protected isAuthPage = signal(false);
  private router = inject(Router);
  private authService = inject(AuthService);

  role = this.authService.role;

  ngOnInit() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkUrl(event.url);
      });

    // Initial check
    this.checkUrl(this.router.url);
  }

  private checkUrl(url: string) {
    // Check if the URL contains 'login' or 'register'
    // This simple check might need refinement if you have nested routes, but works for top-level
    this.isAuthPage.set(url.includes('/login') || url.includes('/register'));
  }
}
