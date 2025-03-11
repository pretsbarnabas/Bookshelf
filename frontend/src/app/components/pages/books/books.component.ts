import { Component, Renderer2, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { FormlyModule } from '@ngx-formly/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { BookService } from '../../../services/book.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Book } from '../../../models/Book';

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
    CommonModule,
    MatPaginator,
  ],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
  providers: [DatePipe]
})
export class BooksComponent implements OnInit {
  @ViewChild('container') container!: ElementRef;
  @ViewChild('showMoreButton') showMoreButton!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  books: Book[] = [];
  paginatedBooks: Book[] = [];
  pageSize = 10;

  constructor(private renderer: Renderer2, private bookService: BookService, private datePipe: DatePipe, private router: Router) {}

  ngOnInit() {
    this.bookService.getAllBooks(this.pageSize).subscribe({
      next: (data) => {
        this.books = data;
        this.updatePaginatedBooks();
      },
      error: (err) => {
        console.error('Error fetching books', err);
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    console.log(this.pageSize);
    this.updatePaginatedBooks(event.pageIndex);
  }

  updatePaginatedBooks(pageIndex: number = 0) {
    const startIndex = pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedBooks = this.books.slice(startIndex, endIndex);
  }
  navigateToBook(bookId: string) {
    this.router.navigate(['/book-item', bookId]);
  }

  formatDate(date: any) {
    return this.datePipe.transform(date, 'yyyy');
  }
}