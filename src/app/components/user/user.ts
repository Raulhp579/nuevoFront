import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  datasource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['id', 'nombre', 'email', 'botones'];

  // Modal State
  isEditOpen = false;
  isCreateOpen = false;

  // Create / Edit Objects
  currentUser: any = { id: 0, name: '', email: '', password: '' };
  newUser: any = { name: '', email: '', password: '' };

  constructor(private userService: UserService) {}

  async loadTable() {
    const users = await firstValueFrom(this.userService.verUsuarios());
    this.datasource.data = users;
    if (this.paginator) {
      this.datasource.paginator = this.paginator;
    }
  }

  async ngOnInit() {
    this.loadTable();
  }

  ngAfterViewInit() {
    this.datasource.paginator = this.paginator;
    this.paginator.pageSize = 8;
  }

  deleteUser(id_user: number) {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;

    this.userService.borrarUsuario(id_user).subscribe((response) => {
      console.log(response);
      this.loadTable();
    });
  }

  // --- EDIT ---
  openEdit(user: any) {
    this.currentUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: '',
    };
    this.isEditOpen = true;
  }

  closeEdit() {
    this.isEditOpen = false;
    this.currentUser = { id: 0, name: '', email: '', password: '' };
  }

  async updateUser() {
    try {
      if (!this.currentUser.id) return;

      const payload: any = {
        name: this.currentUser.name,
        email: this.currentUser.email,
      };

      if (this.currentUser.password && this.currentUser.password.trim() !== '') {
        payload.password = this.currentUser.password;
      }

      await firstValueFrom(this.userService.editarUsuario(this.currentUser.id, payload));

      this.closeEdit();
      await this.loadTable();
      alert('Usuario actualizado correctamente');
    } catch (error: any) {
      console.error('Error updating user', error);
      alert(error.error?.error || 'Error al actualizar el usuario');
    }
  }

  // --- CREATE ---
  openCreate() {
    this.newUser = { name: '', email: '', password: '' };
    this.isCreateOpen = true;
  }

  closeCreate() {
    this.isCreateOpen = false;
    this.newUser = { name: '', email: '', password: '' };
  }

  async createUser() {
    try {
      // Basic validation
      if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
        alert('Por favor complete todos los campos');
        return;
      }

      await firstValueFrom(this.userService.crearUsuario(this.newUser));

      this.closeCreate();
      await this.loadTable();
      alert('Usuario creado correctamente');
    } catch (error: any) {
      console.error('Error creating user', error);
      alert(error.error?.error || 'Error al crear el usuario');
    }
  }
}
