import { Component, ViewEncapsulation } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BookService } from '../../../services/page/book.service';
import { BookModel, BookRoot } from '../../../models/Book';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../../services/global/auth.service';
import { UserModel } from '../../../models/User';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-home',
  imports: [TranslatePipe, MatCardModule, CommonModule, MatButtonModule, MatIconModule],
  providers: [DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  constructor(private bookService: BookService,private router:Router, private datePipe: DatePipe, private authService:  AuthService ) { }
  pageSize = 10;
  currentPageIndex = 0;
  maxPages = 0;
  books: BookModel[] = [];
  isLoggedIn: boolean = false;
  loggedInUser: UserModel | null = null;

  ngOnInit(): void {
    this.getBooks();
    this.authService.loggedInUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.loggedInUser = user;
    });
   }
   navigateTo(route: string): void {
    this.router.navigate([route]);
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
