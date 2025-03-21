import { Component, ElementRef, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { BookService } from '../../../services/page/book.service';
import { ReviewService } from '../../../services/page/review.service';
import { Book } from '../../../models/Book';
import { Review } from '../../../models/Review';
import { UserModel } from '../../../models/User';
import { UserService } from '../../../services/page/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { ExpansionItemComponent } from './expansion-item/expansion-item.component';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomPaginatorComponent } from "../../../utilities/components/custom-paginator/custom-paginator.component";
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-admin',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatExpansionModule,
        ExpansionItemComponent,
        TranslatePipe,
        CustomPaginatorComponent,
    ],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('onChange', [
            transition('* => *', [
                style({ opacity: 0, transform: 'translateY(-10px)' }),
                animate('500ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
            ]),
        ])
    ]
})
export class AdminComponent {
    private userService = inject(UserService);
    private bookService = inject(BookService);
    private reviewService = inject(ReviewService);

    currentArrayInPaginator: UserModel[] | Book[] | Review[] = [];
    itemType: 'user' | 'book' | 'review' = 'user';
    disabledButton: 'users' | 'books' | 'reviews' = 'users';
    animate: boolean = false;

    maxPages: number = 0;
    currentPageIndex = 0;

    users: UserModel[] = [];
    books: Book[] = [];
    reviews: Review[] = [];
    pageSize: number = 10;

    errorMessages: HttpErrorResponse[] = [];
    @ViewChild('errorAlert', { static: false }) errorAlert!: ElementRef;


    constructor() {

    }

    ngOnInit() {
        this.getUsers();
    }

    changePaginatedArray(_array: 'users' | 'books' | 'reviews') {
        this.errorMessages = [];
        if (this.disabledButton != _array)
            this.currentPageIndex = 0;
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
        this.animate = !this.animate;
    }

    private onError(_error: HttpErrorResponse) {
        this.errorMessages.push(_error);
        setTimeout(() => {
            this.errorAlert.nativeElement.scrollIntoView({ behavior: 'smooth' });
        });
    }

    getUsers() {
        this.userService.getAllUser(this.pageSize, this.currentPageIndex).subscribe({
            next: (data) => {
                this.users = data.data;
                this.users = this.users.filter(u => u.role != 'admin');
                this.itemType = 'user';
                this.maxPages = data.pages;
                this.currentArrayInPaginator = this.users;
            },
            error: (err) => {
                this.onError(err);
            }
        });
    }

    getBooks() {
        this.bookService.getAllBooks(this.pageSize, this.currentPageIndex).subscribe({
            next: (data) => {
                this.books = data.data;
                this.itemType = 'book';
                this.maxPages = data.pages;
                this.currentArrayInPaginator = this.books;
            },
            error: (err) => {
                this.onError(err);
            }
        });
    }

    getReviews() {
        this.reviewService.getAllReviews(this.pageSize, this.currentPageIndex).subscribe({
            next: (data) => {
                this.reviews = data.data;
                this.itemType = 'review';
                this.maxPages = data.pages;
                this.currentArrayInPaginator = this.reviews;
            },
            error: (err) => {
                this.onError(err);                
            }
        });
    }

    changePage(changes: { pageIndex: number; pageSize: number }) {
        this.currentPageIndex = changes.pageIndex;
        this.pageSize = changes.pageSize;
        this.changePaginatedArray(this.disabledButton);
    }
}
