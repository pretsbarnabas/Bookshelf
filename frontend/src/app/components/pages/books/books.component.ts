import { Component, Renderer2, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormlyModule } from '@ngx-formly/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookService } from '../../../services/book.service';
import { CommonModule} from '@angular/common';


@Component({
  selector: 'app-books',
  standalone: true,
  imports: [        
    FormlyModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormlyMaterialModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  @ViewChild('container') container!: ElementRef;
  @ViewChild('showMoreButton') showMoreButton!: ElementRef;

  books: any[] = [];

  constructor(private renderer: Renderer2, private bookService: BookService) {}

  ngOnInit() {
    this.bookService.getAllBooks().subscribe({
      next: (data) => {
        this.books = data;
        console.log(this.books);
      },
      error: (err) => {
        console.error('Error fetching books', err);
      }
    });
  }

  isExpanded = false;
  showMore() {
    if (!this.isExpanded) {
      const containerEl = this.container.nativeElement;
      const buttonEl = this.showMoreButton.nativeElement;
      this.renderer.setStyle(containerEl, 'height', '700px');
      this.renderer.setStyle(buttonEl, 'transform', 'scaleY(-1)');
      this.isExpanded = true;      
    } else {
      const containerEl = this.container.nativeElement;
      const buttonEl = this.showMoreButton.nativeElement;
      this.renderer.setStyle(containerEl, 'height', '10vh');
      this.renderer.setStyle(buttonEl, 'transform', 'scaleY(1)');
      this.isExpanded = false;
    }
  }
}