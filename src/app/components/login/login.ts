import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { firstValueFrom } from 'rxjs';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    ReactiveFormsModule,
    MatError,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  hidePass = true;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  loginError: string = '';

  async onSubmit() {
    this.loginError = '';
    const user = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    try {
      const response = await firstValueFrom(this.authService.login(user));

      localStorage.setItem('token', response.token);
      this.authService.setRole(response.role);
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error en login:', error);
      this.loginError = 'Email o contraseña incorrectos. Inténtelo de nuevo.';
    }
  }
}
