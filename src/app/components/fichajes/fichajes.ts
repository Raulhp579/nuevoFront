import { Component, OnInit } from '@angular/core';
import { TimeEntrieService } from '../../services/time-entrie-service';
import { firstValueFrom } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fichajes',
  imports: [MatTableModule, MatIconModule, DatePipe],
  templateUrl: './fichajes.html',
  styleUrl: './fichajes.css',
})
export class Fichajes implements OnInit {
  datasource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['id', 'usuario', 'entrada', 'salida', 'botones'];

  constructor(
    private timeEntrieService: TimeEntrieService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    const timeEntries = await firstValueFrom(
      this.timeEntrieService.getTimeEntries()
    );
    const users = await firstValueFrom(this.userService.verUsuarios());

    const times: any[] = [];
    timeEntries.forEach(
      (timeEntrie: {
        id: any;
        user_id: number;
        clock_in_at: any;
        clock_out_at: any;
      }) => {
        const time = {
          id: timeEntrie.id,
          usuario: this.associateUserId(timeEntrie.user_id, users),
          entrada: timeEntrie.clock_in_at,
          salida: timeEntrie.clock_out_at,
        };

        times.push(time);
      }
    );

    this.datasource.data = times;
  }

  associateUserId(id_user: number, users: Array<any>) {
    const user = users.find((item) => item.id === id_user);
    return user ? user.name : `Usuario ${id_user}`;
  }
}
