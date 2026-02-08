import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TimeEntrieService } from '../services/time-entrie-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fichajes-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    DatePipe,
  ],
  templateUrl: './fichajes-usuario.html',
  styleUrl: './fichajes-usuario.css',
})
export class FichajesUsuario implements OnInit {
  displayedColumns: string[] = ['entrada', 'salida', 'horas'];
  dataSource = new MatTableDataSource<any>([]);
  selectedDate: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private isOverlayClick = false;

  constructor(
    private timeEntriesService: TimeEntrieService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  onOverlayMouseDown(event: MouseEvent) {
    this.isOverlayClick = event.target === event.currentTarget;
  }

  handleOverlayClose(event: MouseEvent, closeFn: () => void) {
    if (this.isOverlayClick && event.target === event.currentTarget) {
      closeFn();
    }
    this.isOverlayClick = false;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTimeEntries();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTimeEntries() {
    let dateParam: any = undefined;
    if (this.selectedDate) {
      // Format date to YYYY-MM-DD to match backend expectation
      const year = this.selectedDate.getFullYear();
      const month = ('0' + (this.selectedDate.getMonth() + 1)).slice(-2);
      const day = ('0' + this.selectedDate.getDate()).slice(-2);
      dateParam = `${year}-${month}-${day}`;
    }

    this.timeEntriesService.getAllOfOneUser(dateParam).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error('Error loading time entries', err);
      },
    });
  }

  onDateChange(event: any) {
    this.selectedDate = event.value;
    this.loadTimeEntries();
  }

  clearDate() {
    this.selectedDate = null;
    this.loadTimeEntries();
  }

  calculateHours(entrada: string, salida: string | null): string {
    if (!salida) return 'En curso';

    const start = new Date(entrada);
    const end = new Date(salida);
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);

    return diffHrs.toFixed(2) + ' h';
  }
}
