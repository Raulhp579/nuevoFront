import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class CheckRole {
  private authService = inject(AuthService);

  isAdmin(): boolean {
    return this.authService.role() == 'admin';
  }
}
