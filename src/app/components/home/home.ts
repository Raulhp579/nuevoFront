import { Component, effect, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { interval } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [MatIconModule,DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  date = new Date();
  currentTime = signal<Date>(new Date)

  updateTime = effect(()=>{
    interval(1000).subscribe(()=>{
      this.currentTime.set(new Date)
    })
  })



}
