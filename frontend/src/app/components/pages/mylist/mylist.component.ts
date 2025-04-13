import {
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { BooklistService } from '../../../services/page/booklist.service';
import { AuthService } from '../../../services/global/auth.service';
import { BookList } from '../../../models/Booklist';
import { UserModel } from '../../../models/User';

import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { BookCardComponent } from "./book-card/book-card.component";
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-mylist',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatTabsModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        DragDropModule,
        BookCardComponent,
        FlexLayoutModule,
        MatDividerModule,
        MatExpansionModule,
        TranslatePipe
    ],
    templateUrl: './mylist.component.html',
    styleUrls: ['./mylist.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MylistComponent implements OnInit {
    @ViewChild('sidenav') sidenav!: MatSidenav;
    accordion = viewChild.required(MatAccordion);

    toggleSidenav() {
        this.sidenav.toggle();
    }

    bookList: BookList[] | null = null;
    toReadBooks: any[] = [];
    hasReadBooks: any[] = [];
    readingBooks: any[] = [];
    droppedBooks: any[] = [];
    favoriteBooks: any[] = [];
    loggedInUser: UserModel | null = null;
    selectedTab: string = 'toRead';
    dragDisabled: boolean = false;
    hoveredList: string | null = null;

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

    trackByBookId(index: number, book: any): string {
        return book._id || index.toString();
    }

    fetchUserBookList(userId: string) {
        this.booklistService.getUserBookList(userId).subscribe({
            next: (data) => {
                this.bookList = data;
                this.categorizeBooks();
            },
            error: (err) => {
                console.error('Error fetching user book list:', err);
                this.bookList = [];
            }
        });
    }

    categorizeBooks() {
        const toRead: any[] = [];
        const hasRead: any[] = [];
        const reading: any[] = [];
        const dropped: any[] = [];
        const favorite: any[] = [];

        const previousBooksMap = new Map<string, any>();
        [
            ...this.toReadBooks,
            ...this.hasReadBooks,
            ...this.readingBooks,
            ...this.droppedBooks,
            ...this.favoriteBooks
        ].forEach(b => previousBooksMap.set(b._id, b));

        this.bookList!.forEach(item => {
            const book = previousBooksMap.get(item.book._id) || item.book;

            switch (item.read_status) {
                case 'to_read':
                    toRead.push(book);
                    break;
                case 'has_read':
                    hasRead.push(book);
                    break;
                case 'is_reading':
                    reading.push(book);
                    break;
                case 'dropped':
                    dropped.push(book);
                    break;
                case 'favorite':
                    favorite.push(book);
                    hasRead.push(book);
                    break;
                default:
                    console.warn(`Unknown read_status: ${item.read_status}`);
            }
        });

        this.toReadBooks = toRead;
        this.hasReadBooks = hasRead;
        this.readingBooks = reading;
        this.droppedBooks = dropped;
        this.favoriteBooks = favorite;
    }

    ToRead(bookId: string) {
        if (!this.loggedInUser) return;
        this.booklistService.updateBookStatus(this.loggedInUser._id, bookId, 'to_read').subscribe({
            next: (res) => {
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
                this.fetchUserBookList(this.loggedInUser!._id);
            },
            error: (err) => {
                console.error('Error updating book status to "is_reading":', err);
            }
        });
    }

    finishReading(bookId: string) {
        if (!this.loggedInUser) return;
        this.booklistService.updateBookStatus(this.loggedInUser._id, bookId, 'has_read').subscribe({
            next: () => {
                this.fetchUserBookList(this.loggedInUser!._id);
            },
            error: (err) => {
                console.error('Error updating book status to "has_read":', err);
            }
        });
    }

    markAsFavorite(bookId: string) {
        if (!this.loggedInUser) return;
        this.booklistService.updateBookStatus(this.loggedInUser._id, bookId, 'favorite').subscribe({
            next: () => {
                this.fetchUserBookList(this.loggedInUser!._id);
            },
            error: (err) => {
                console.error('Error updating book status to "favorite":', err);
            }
        });
    }

    dropBook(bookId: string) {
        if (!this.loggedInUser) return;
        this.booklistService.updateBookStatus(this.loggedInUser._id, bookId, 'dropped').subscribe({
            next: () => {
                this.fetchUserBookList(this.loggedInUser!._id);
            },
            error: (err) => {
                console.error('Error updating book status to "dropped":', err);
            }
        });
    }

    deleteBook(bookId: string) {
        if (!this.loggedInUser) return;
        this.booklistService.updateBookStatus(this.loggedInUser._id, bookId, 'delete').subscribe({
            next: () => {
                this.fetchUserBookList(this.loggedInUser!._id);
            },
            error: (err) => {
                console.error('Error deleting book:', err);
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

            const book = event.container.data[event.currentIndex];
            if (!book || !book._id) return;

            this.dragDisabled = true;

            const dropId = event.container.id;

            if (dropId === 'readingList') {
                this.startReading(book._id);
            } else if (dropId === 'toReadList') {
                this.ToRead(book._id);
            } else if (dropId === 'finishedList') {
                this.finishReading(book._id);
            }

            setTimeout(() => {
                this.fetchUserBookList(this.loggedInUser!._id);
                this.dragDisabled = false;
            }, 250);
        }
    }
}
