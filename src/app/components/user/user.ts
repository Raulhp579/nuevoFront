import { Component, OnInit } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { UserService } from '../../services/user-service';
import { firstValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user',
  imports: [MatTableModule,MatIconModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User implements OnInit{
  constructor(private userService:UserService){}
  datasource = new MatTableDataSource<any>()


  async ngOnInit() {
    const users = await firstValueFrom(
      this.userService.verUsuarios()
    )

    this.datasource.data = users
  }
  



  displayedColumns: string[] = ['id', 'nombre', 'email','botones'];

}
