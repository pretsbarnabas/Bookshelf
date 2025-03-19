import { Component, inject, ViewEncapsulation } from '@angular/core';
import { BookService } from '../../../services/page/book.service';
import { ReviewService } from '../../../services/page/review.service';
import { Book } from '../../../models/Book';
import { Review } from '../../../models/Review';
import { UserModel } from '../../../models/User';
import { UserService } from '../../../services/page/user.service';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { ExpansionItemComponent } from './expansion-item/expansion-item.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject } from 'rxjs';

export class CustomPaginatorIntl extends MatPaginatorIntl {
    override itemsPerPageLabel = 'Items per page:';
    override nextPageLabel = 'Next';
    override previousPageLabel = 'Previous';
    override firstPageLabel = 'First page';
    override lastPageLabel = 'Last page';

    override getRangeLabel = (page: number, pageSize: number, length: number): string => {
        return `Page ${page + 1} of ${length}`;
    };

}

@Component({
    selector: 'app-admin',
    imports: [
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatExpansionModule,
        ExpansionItemComponent,
        TranslatePipe
    ],
    providers: [
        { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
    ],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class AdminComponent {
    private userService = inject(UserService);
    private bookService = inject(BookService);
    private reviewService = inject(ReviewService);

    currentArrayInPaginator: UserModel[] | Book[] | Review[] = [];
    itemType: 'user' | 'book' | 'review' = 'user';
    disabledButton: 'users' | 'books' | 'reviews' = 'users';

    maxPages: number = 0;
    currentPageIndex = 0;

    users: UserModel[] = [];
    books: Book[] = [];
    reviews: Review[] = [];
    pageSize: number = 10;

    get isPrevDisabled(): boolean {
        return this.currentPageIndex === 0;
    }

    get isNextDisabled(): boolean {
        return this.currentPageIndex >= this.maxPages - 1;
    }

    constructor() {

    }

    ngOnInit() {
        this.getUsers();
    }

    changePaginatedArray(_array: 'users' | 'books' | 'reviews') {
        this.disabledButton = _array;
        switch (_array) {
            case 'users':
                this.getUsers();
                break;
            case 'books':
                this.getBooks();
                break;
            case 'reviews':
                this.getReviews();
                break;
        }
    }

    getUsers() {
        this.userService.getAllUser(this.pageSize).subscribe({
            next: (data) => {
                this.users = data.data;
                this.users = this.users.filter(u => u.role != 'admin');
                this.itemType = 'user';
                this.maxPages = data.pages;
                this.currentArrayInPaginator = this.users;
            },
            error: (err) => {
                console.error('Error fetching users', err);
            }
        });
    }

    getBooks() {
        this.bookService.getAllBooks(this.pageSize).subscribe({
            next: (data) => {
                this.books = data.data;
                this.itemType = 'book';
                this.maxPages = data.pages;
                this.currentArrayInPaginator = this.books;
            },
            error: (err) => {
                console.error('Error fetching books', err);
            }
        });
    }

    getReviews() {
        this.reviewService.getAllReviews(this.pageSize).subscribe({
            next: (data) => {
                this.reviews = data.data;
                this.itemType = 'review';
                this.maxPages = data.pages;
                this.currentArrayInPaginator = this.reviews;
            },
            error: (err) => {
                console.error('Error fetching reviews', err);
            }
        });
    }

    pageEvent(event: any) {
        this.pageSize = event.pageSize;
        switch (this.disabledButton) {
            case 'users':
                this.getUsers();
                break;
            case 'books':
                this.getBooks();
                break;
            case 'reviews':
                this.getReviews();
                break;
        }
    }

    changePage(to: 'next' | 'prev') {
        console.log(to)
    }
}
