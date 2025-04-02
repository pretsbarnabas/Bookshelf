import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { BooklistService } from '../../../services/page/booklist.service';
import { AuthService } from '../../../services/global/auth.service';
import { BookList } from '../../../models/Booklist';
import { UserModel } from '../../../models/User'; // Import UserModel
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-mylist',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatTabsModule,
        TranslatePipe
    ],
    templateUrl: './mylist.component.html',
    styleUrls: ['./mylist.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MylistComponent implements OnInit {
    bookList: BookList[] | null = null;
    toReadBooks: any[] = [];
    hasReadBooks: any[] = [];
    readingBooks: any[] = [];
    droppedBooks: any[] = [];
    favoriteBooks: any[] = [];
    loggedInUser: UserModel | null = null; // Store the logged-in user

    constructor(
        private booklistService: BooklistService,
        private authService: AuthService
    ) { }

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
                console.log(this.bookList)
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

        // Categorize books based on read_status
        this.bookList!.forEach(item => {
            const book = item.book; // Access the book object
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
                    this.hasReadBooks.push(book); // Add to hasReadBooks if it's also a favorite
                    break;
                default:
                    console.warn(`Unknown read_status: ${item.read_status}`);
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

        this.booklistService.updateBookStatus(this.loggedInUser._id, bookId, 'deleted').subscribe({
            next: () => {
                console.log(`Book with ID ${bookId} marked as "deleted"`);

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
                this.fetchUserBookList(this.loggedInUser!._id); // Refresh the categorized lists
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
                this.fetchUserBookList(this.loggedInUser!._id); // Refresh the categorized lists
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
                this.fetchUserBookList(this.loggedInUser!._id); // Refresh the categorized lists
            },
            error: (err) => {
                console.error('Error updating book status to "favorite":', err);
            }
        });
    }
}