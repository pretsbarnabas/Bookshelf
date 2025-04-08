import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { BooklistService } from '../../../services/page/booklist.service';
import { AuthService } from '../../../services/global/auth.service';
import { BookList } from '../../../models/Booklist';
import { UserModel } from '../../../models/User';
import {CdkDragDrop, CdkDrag, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem,} from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';


@Component({
  selector: 'app-mylist',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    CdkDropListGroup, 
    CdkDropList,
    CdkDrag,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
  ],
  templateUrl: './mylist.component.html',
  styleUrls: ['./mylist.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MylistComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  toggleSidenav() {
    this.sidenav.toggle();
  }
  bookList: BookList[] | null = null;
  toReadBooks: any[] = [];
  hasReadBooks: any[] = [];
  readingBooks: any[] = [];
  droppedBooks: any[] = [];
  favoriteBooks: any[] = [];
  loggedInUser: UserModel | null = null; // Store the logged-in user
  selectedTab: string = 'toRead';
  
  constructor(
    private booklistService: BooklistService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.loggedInUser$.subscribe((user) => {
        this.loggedInUser = user;
        if (this.loggedInUser) {
            this.fetchUserBookList(this.loggedInUser._id);

        }
    });
  }

  fetchUserBookList(userId: string) {
    this.booklistService.getUserBookList(userId).subscribe({
      next: (data) => {
          this.bookList = data;
          this.CategorizeBooks();
      },
      error: (err) => {
        console.error('Error fetching user book list:', err);
        this.bookList = [];
      }
    });
  }
  CategorizeBooks() {  
    this.toReadBooks = [];
    this.hasReadBooks = [];
    this.readingBooks = [];
    this.droppedBooks = [];
    this.favoriteBooks = [];
  
    this.bookList!.forEach(item => {
      const book = item.book; 
      switch (item.read_status) {
        case 'to_read':
          this.toReadBooks.push(book);
          break;
        case 'has_read':
          this.hasReadBooks.push(book);
          break;
        case 'is_reading':
          this.readingBooks.push(book);
          break;
        case 'dropped':
          this.droppedBooks.push(book);
          break;
        case 'favorite':
          this.favoriteBooks.push(book);
          this.hasReadBooks.push(book);
          break;
        default:
          console.warn(`Unknown read_status: ${item.read_status}`);
      }
    });
  }
  ToRead(bookId: string) {
    if (!this.loggedInUser) return;

    this.booklistService.updateBookStatus(this.loggedInUser._id, bookId, 'to_read').subscribe({
        next: () => {
            console.log(`Book with ID ${bookId} updated to "to_read"`);
            this.fetchUserBookList(this.loggedInUser!._id);
        },
        error: (err) => {
            console.error('Error updating book status:', err);
        }
    });
  }
  startReading(bookId: string) {
    if (!this.loggedInUser) return;

    this.booklistService.updateBookStatus(this.loggedInUser._id, bookId, 'is_reading').subscribe({
        next: () => {
            console.log(`Book with ID ${bookId} updated to "is_reading"`);
            this.fetchUserBookList(this.loggedInUser!._id);
        },
        error: (err) => {
            console.error('Error updating book status:', err);
        }
    });
  }

  deleteBook(bookId: string) {
      if (!this.loggedInUser) return;

      this.booklistService.updateBookStatus(this.loggedInUser._id, bookId, 'delete').subscribe({
          next: () => {
              console.log(`Book with ID ${bookId} marked as "deleted"`);
              this.fetchUserBookList(this.loggedInUser!._id); 

              
          },
          error: (err) => {
              console.error('Error deleting book:', err);
          }
      });
  }
  finishReading(bookId: string) {
    if (!this.loggedInUser) return;

    this.booklistService.updateBookStatus(this.loggedInUser._id, bookId, 'has_read').subscribe({
        next: () => {
            console.log(`Book with ID ${bookId} updated to "has_read"`);
            this.fetchUserBookList(this.loggedInUser!._id); 
        },
        error: (err) => {
            console.error('Error updating book status to "has_read":', err);
        }
    });
}

dropBook(bookId: string) {
    if (!this.loggedInUser) return;

    this.booklistService.updateBookStatus(this.loggedInUser._id, bookId, 'dropped').subscribe({
        next: () => {
            console.log(`Book with ID ${bookId} updated to "dropped"`);
            this.fetchUserBookList(this.loggedInUser!._id);
        },
        error: (err) => {
            console.error('Error updating book status to "dropped":', err);
        }
    });
}
markAsFavorite(bookId: string) {
  if (!this.loggedInUser) return;

  this.booklistService.updateBookStatus(this.loggedInUser._id, bookId, 'favorite').subscribe({
      next: () => {
          console.log(`Book with ID ${bookId} marked as "favorite"`);
          this.fetchUserBookList(this.loggedInUser!._id); 
      },
      error: (err) => {
          console.error('Error updating book status to "favorite":', err);
      }
  });
  
}
drop(event: CdkDragDrop<any[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    console.log(event.container.data[event.currentIndex]);
    if (event.container.id === 'cdk-drop-list-1') {
      this.startReading(event.container.data[event.currentIndex]._id);
      this.fetchUserBookList(this.loggedInUser!._id);
    }
    else if (event.container.id === 'cdk-drop-list-0') {
      this.ToRead(event.container.data[event.currentIndex]._id);
      this.fetchUserBookList(this.loggedInUser!._id);
    }
    else if (event.container.id === 'cdk-drop-list-2') {
      this.finishReading(event.container.data[event.currentIndex]._id);
      this.fetchUserBookList(this.loggedInUser!._id);
    }
  }
}
}
