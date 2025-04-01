import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { BooklistService } from '../../../services/page/booklist.service';
import { AuthService } from '../../../services/global/auth.service';
import { BookList } from '../../../models/Booklist';
import { UserModel } from '../../../models/User'; // Import UserModel

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
export class MylistComponent implements OnInit {
  bookList: BookList | null = null;
  toReadBooks: any[] = [];
  hasReadBooks: any[] = [];
  readingBooks: any[] = [];
  droppedBooks: any[] = [];
  favoriteBooks: any[] = [];
  loggedInUser: UserModel | null = null; // Store the logged-in user

  constructor(
    private booklistService: BooklistService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Subscribe to the loggedInUser$ observable to get the actual logged-in user
    this.authService.loggedInUser$.subscribe((user) => {
      this.loggedInUser = user;
      if (this.loggedInUser) {
        this.fetchUserBookList(this.loggedInUser._id);
      }
    });
  }

  fetchUserBookList(userId: string) {
    this.booklistService.getUserBookList(userId).subscribe((data) => {
      this.bookList = data;
      console.log('Book List:', this.bookList);
      this.categorizeBooks(data.books);
    });
  }

  categorizeBooks(books: any[]) {
    this.toReadBooks = books.filter(book => book.read_status === 'to_read');
    this.hasReadBooks = books.filter(book => book.read_status === 'has_read');
    this.readingBooks = books.filter(book => book.read_status === 'is_reading');
    this.droppedBooks = books.filter(book => book.read_status === 'dropped');
    this.favoriteBooks = books.filter(book => book.read_status === 'favorite');
  }
}