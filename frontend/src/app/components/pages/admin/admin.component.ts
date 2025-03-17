import { Component, inject, ViewEncapsulation } from '@angular/core';
import { BookService } from '../../../services/page/book.service';
import { ReviewService } from '../../../services/page/review.service';
import { Book } from '../../../models/Book';
import { Review } from '../../../models/Review';

@Component({
    selector: 'app-admin',
    imports: [],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class AdminComponent {
    private bookService = inject(BookService);
    private reviewService = inject(ReviewService);

    books: Book[] = [];
    reviews: Review[] = [];
    pageSize: number = 10;

    constructor() {

    }

    ngOnInit() {
        this.bookService.getAllBooks(this.pageSize).subscribe({
            next: (data) => {
                this.books = data.data;
                console.log(this.books)
            },
            error: (err) => {
                console.error('Error fetching books', err);
            }
        });
        this.reviewService.getAllReviews(this.pageSize).subscribe({
            next: (data) => {
                this.reviews = data.data;
                console.log(this.reviews)
            },
            error: (err) => {
                console.error('Error fetching books', err);
            }
        });
    }
}
