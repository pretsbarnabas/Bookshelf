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
    { title: 'Book 1', author: 'Author 1', image: 'https://via.placeholder.com/150', description: 'Description 1' },
    { title: 'Book 2', author: 'Author 2', image: 'https://via.placeholder.com/150', description: 'Description 2' },
  ];

  readingBooks = [
    { title: 'Book 3', author: 'Author 3', image: 'https://via.placeholder.com/150', description: 'Description 3' },
    { title: 'Book 4', author: 'Author 4', image: 'https://via.placeholder.com/150', description: 'Description 4' },
  ];

  stoppedReadingBooks = [
    { title: 'Book 5', author: 'Author 5', image: 'https://via.placeholder.com/150', description: 'Description 5' },
    { title: 'Book 6', author: 'Author 6', image: 'https://via.placeholder.com/150', description: 'Description 6' },
  ];
}