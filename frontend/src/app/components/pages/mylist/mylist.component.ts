import { Component, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mylist',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule
  ],
  templateUrl: './mylist.component.html',
  styleUrls: ['./mylist.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MylistComponent {
  toReadBooks = [
    { title: 'Book 1', author: 'Author 1', image: 'assets/images/bingus.webp'},
    { title: 'Book 2', author: 'Author 2', image: 'assets/images/bingus.webp'},
  ];

  readingBooks = [
    { title: 'Book 3', author: 'Author 3', image: 'assets/images/bingus.webp'},
    { title: 'Book 4', author: 'Author 4', image: 'assets/images/bingus.webp'},
  ];

  stoppedReadingBooks = [
    { title: 'Book 5', author: 'Author 5', image: 'assets/images/bingus.webp'},
    { title: 'Book 6', author: 'Author 6', image: 'assets/images/bingus.webp'},
  ];
}