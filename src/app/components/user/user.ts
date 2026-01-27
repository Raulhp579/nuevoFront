import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { UserService } from '../../services/user-service';
import { response } from 'express';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatPaginatorModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  datasource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['id', 'nombre', 'email', 'botones'];

  constructor(private userService: UserService) {}

  async loadTable(){
    const users = await firstValueFrom(this.userService.verUsuarios());
    this.datasource.data = users;
  }

  async ngOnInit() {
    this.loadTable()
  }

  ngAfterViewInit() {
    this.datasource.paginator = this.paginator;
    this.paginator.pageSize = 8; 
  }

  deleteUser(id_user:number){
    this.userService.borrarUsuario(id_user).subscribe((response)=>{
      console.log(response)
      this.loadTable()
    })


  }
}
