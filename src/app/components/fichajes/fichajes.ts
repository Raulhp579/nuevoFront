import { Component, OnInit, AfterViewInit, ViewChild,ChangeDetectionStrategy } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DatePipe, NgClass } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { TimeEntrieService } from '../../services/time-entrie-service';
import { UserService } from '../../services/user-service';

import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import {MatTimepickerModule} from '@angular/material/timepicker';
import {MatIcon} from '@angular/material/icon';
import {provideNativeDateAdapter} from '@angular/material/core'
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
type TabKey = 'all' | 'open' | 'closed';

@Component({
  selector: 'app-fichajes',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatPaginatorModule,
    DatePipe,
    MatProgressBarModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTimepickerModule,
    MatIcon,
    FormsModule
    
],
  templateUrl: './fichajes.html',
  styleUrl: './fichajes.css',
})
export class Fichajes implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  datasource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['id', 'usuario', 'entrada', 'salida', 'botones'];

  private allRows: any[] = [];
  activeTab: TabKey = 'all';

  counts = { all: 0, open: 0, closed: 0 };

  constructor(
    private timeEntrieService: TimeEntrieService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    await this.loadTable();
    this.applyTab(this.activeTab);
  }

  ngAfterViewInit(): void {
    this.datasource.paginator = this.paginator;
    this.paginator.pageSize = 8;
  }

  trackById(_: number, row: any) {
    return row.id;
  }

  async loadTable() {
    const [timeEntries, users] = await Promise.all([
      firstValueFrom(this.timeEntrieService.getTimeEntries()),
      firstValueFrom(this.userService.verUsuarios()),
    ]);

    this.allRows = timeEntries.map((t: any) => ({
      id: t.id,
      usuario: this.associateUserId(t.user_id, users),
      entrada: t.clock_in_at,
      salida: t.clock_out_at,
    }));

    this.counts.all = this.allRows.length;
    this.counts.open = this.allRows.filter(r => r.salida == null).length;
    this.counts.closed = this.allRows.filter(r => r.salida != null).length;
  }

  associateUserId(id_user: number, users: Array<any>) {
    const user = users.find((u) => u.id === id_user);
    return user ? user.name : `Usuario ${id_user}`;
  }

  onTabChange(index: number) {
    const key: TabKey = index === 1 ? 'open' : index === 2 ? 'closed' : 'all';
    this.applyTab(key);
  }

  applyTab(key: TabKey) {
    this.activeTab = key;

    const filtered =
      key === 'open'
        ? this.allRows.filter(r => r.salida == null)
        : key === 'closed'
          ? this.allRows.filter(r => r.salida != null)
          : this.allRows;

    this.datasource.data = filtered;

    // reset de paginación al cambiar pestaña
    queueMicrotask(() => this.paginator?.firstPage());
  }

  async deleteTimeEntrie(id: number) {
    await firstValueFrom(this.timeEntrieService.deleteTimeEntrie(id));
    await this.loadTable();
    this.applyTab(this.activeTab);
  }

isEditOpen = false;

closeEdit(){
  this.isEditOpen = false;
}

timeEntrie:any = null;

async openEdit(id:number){  
  await this.getTimeEntrie(id)
  this.isEditOpen=true;
}

async getTimeEntrie(id:number){
  await firstValueFrom(
    this.timeEntrie = this.timeEntrieService.getTimeEntrieById(id)
  )
  console.log(this.timeEntrie)
}
}
