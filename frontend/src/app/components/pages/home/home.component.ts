import { Component, ViewEncapsulation } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BookService } from '../../../services/page/book.service';
import { Book } from '../../../models/Book';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [TranslatePipe, MatCardModule, CommonModule],
  providers: [DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  constructor(private bookService: BookService,private router:Router, private datePipe: DatePipe) { }
  pageSize = 10;
  currentPageIndex = 0;
  maxPages = 0;
  books: Book[] = [];

  ngOnInit(): void {
    this.getBooks();
   }

  getBooks(): void {
    this.bookService.getAllBooks(this.pageSize, this.currentPageIndex).subscribe({
      next: (data) => {
          this.books = data.data;
          this.maxPages = data.pages;
      }
    });
  }
  navigateToBook(bookId: string) {
    this.router.navigate(['/book-item', bookId]);
}

formatDate(date: any) {
    return this.datePipe.transform(date, 'yyyy');
}

}
