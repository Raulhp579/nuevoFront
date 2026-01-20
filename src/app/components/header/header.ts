import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
     MatButtonModule, 
     MatIconModule,
     MatSidenavModule,
     MatListModule,
     RouterLink,
     RouterLinkActive,
     RouterOutlet
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

}