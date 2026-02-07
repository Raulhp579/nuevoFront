import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common'; // Import CommonModule
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../services/auth-service';
import { firstValueFrom } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    DatePipe,
    TitleCasePipe,
    BaseChartDirective,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  user = signal<any>(null);
  passwordForm: FormGroup;

  // Statistics
  stats = signal<any[]>([]);
  recentStats = computed(() => this.stats().slice(-2));

  // Chart Data
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Horas trabajadas',
        fill: true,
        tension: 0.5,
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.2)',
        pointBackgroundColor: '#2ecc71',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#2ecc71',
      },
    ],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };
  public lineChartLegend = false;

  constructor() {
    this.passwordForm = this.fb.group(
      {
        current_password: ['', Validators.required],
        new_password: ['', [Validators.required, Validators.minLength(8)]],
        new_password_confirmation: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('new_password')?.value === g.get('new_password_confirmation')?.value
      ? null
      : { mismatch: true };
  }

  async ngOnInit() {
    try {
      const userData = await firstValueFrom(this.userService.userInfo());
      this.user.set(userData);
      this.loadStatistics();
    } catch (error) {
      console.error(error);
    }
  }

  async loadStatistics() {
    try {
      const statsData = await firstValueFrom(this.userService.getStatistics());
      this.stats.set(statsData);

      const labels = statsData.map((s: any) => s.day); // Mon, Tue...
      const data = statsData.map((s: any) => s.hours);

      this.lineChartData = {
        ...this.lineChartData,
        labels: labels,
        datasets: [
          {
            ...this.lineChartData.datasets[0],
            data: data,
          },
        ],
      };
    } catch (error) {
      console.error('Error loading stats', error);
    }
  }

  async onChangePassword() {
    if (this.passwordForm.invalid) return;

    try {
      const { current_password, new_password, new_password_confirmation } = this.passwordForm.value;
      await firstValueFrom(
        this.authService.changePassword({
          current_password,
          new_password,
          new_password_confirmation,
        }),
      );

      this.passwordForm.reset();
      alert('Contraseña actualizada correctamente');
    } catch (error: any) {
      console.error('Error changing password', error);
      alert(error.error?.message || 'Error al cambiar la contraseña');
    }
  }
}
