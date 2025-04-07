import { Component, EventEmitter, inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../services/page/book.service';
import { MatCardModule } from '@angular/material/card';
import { FormlyModule } from '@ngx-formly/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReviewModel } from '../../../models/Review';
import { UserService } from '../../../services/page/user.service';

import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AuthService } from '../../../services/global/auth.service';
import { UserModel } from '../../../models/User';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslationService } from '../../../services/global/translation.service';
import { firstValueFrom } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { RelativeTimePipe } from '../../../pipes/relative-time.pipe';
import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';
import { CustomPaginatorComponent } from '../../../utilities/components/custom-paginator/custom-paginator.component';
import { ReviewDisplayComponent } from './review-display/review-display.component';
import { SortItems } from '../../../utilities/components/sort-items';


@Component({
    selector: 'app-book-item',
    templateUrl: './book-item.component.html',
    styleUrls: ['./book-item.component.scss'],
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
        MatPaginatorModule,
        TranslatePipe,
        MatDividerModule,
        CustomPaginatorComponent,
        ReviewDisplayComponent
    ],
    providers: [DatePipe],
    encapsulation: ViewEncapsulation.None,
})
export class BookItemComponent implements OnInit {
    private translationService = inject(TranslationService);
    private router = inject(Router);

    public book: any;
    public color: string = 'accent';
    public starCount: number = 5;
    public rating: number = 3;
    bookId: any;
    private snackBarDuration: number = 2000;
    public ratingArr: any = [];
    reviews: ReviewModel[] = [];

    paginatedReviews: ReviewModel[] = [];
    currentPageIndex: number = 0;
    maxPages: number = 0;
    pageSize = 10;
    currentSortSettings: { field: string, mode: 'asc' | 'desc' } = { field: '', mode: 'asc' }

    uniqueIds: any = [];
    uniqueUserIds: any = [];
    users: UserModel[] = [];
    isLoggedIn: boolean = false;
    reviewForm: FormGroup;
    loggedInUser: UserModel | null = null;

    constructor(
        private route: ActivatedRoute,
        private bookService: BookService,
        private datePipe: DatePipe,
        private snackBar: MatSnackBar,
        private userService: UserService,
        private authService: AuthService,
        private fb: FormBuilder
    ) {
        this.reviewForm = this.fb.group({
            content: ['', Validators.required]
        });
    }
    ngOnInit() {
        this.uniqueIds = [];
        this.bookId = this.route.snapshot.paramMap.get('id');
        if (this.bookId) {
            this.bookService.getBookById(this.bookId).subscribe(book => {
                this.book = book;
            });
        }
        this.authService.loggedInUser$.subscribe(user => {
            this.isLoggedIn = !!user;
            this.loggedInUser = user;
        });
        if (this.bookId) {
            this.fillreviews();
        }
        for (let index = 0; index < this.starCount; index++) {
            this.ratingArr.push(index);
        }
    }
    fillreviews() {
        this.reviews = [];
        this.bookService.getReviewsByBook(this.bookId, this.currentPageIndex, this.pageSize).subscribe(reviews => {
            this.reviews = reviews.data;
            this.paginatedReviews = reviews.data;
            this.maxPages = reviews.pages;
            for (let i = 0; i < this.reviews.length; i++) {
                if (!this.uniqueUserIds.includes(this.reviews[i].user._id)) {
                    this.uniqueUserIds.push(this.reviews[i].user._id);
                    console.log(this.uniqueUserIds)
                }
                if (!this.reviews[i].user.imageUrl)
                    this.reviews[i].user.profile_image = createAvatar(bottts, { seed: this.reviews[i].user.username }).toDataUri();
            }
        });
    }

    onPageChange(changes: { pageIndex: number; pageSize: number }) {
        this.currentPageIndex = changes.pageIndex;
        this.pageSize = changes.pageSize;
        this.fillreviews();
    }

    formatDate(date: any) {
        return this.datePipe.transform(date, 'yyyy');
    }

    sortItems(_settings: { field: string, mode: 'asc' | 'desc' }): void {
        if (_settings.field === '') {
            this.paginatedReviews = structuredClone(this.reviews);
            return;
        }
        this.currentSortSettings = _settings;
        this.paginatedReviews = structuredClone(this.paginatedReviews);
        this.paginatedReviews = SortItems.generalizedSort(this.paginatedReviews as any[], _settings.field, _settings.mode);
    }

    async onClick(rating: number) {    
        this.snackBar.open(`${await firstValueFrom(this.translationService.service.get('BOOKITEM.SNACKBAR.RATED'))} ` + rating + ' / ' + this.starCount, '', {
            duration: this.snackBarDuration
        });
        this.rating = rating;
        return false;        
    }

    showIcon(index: number) {
        if (this.rating >= index + 1) {
            return 'star';
        } else {
            return 'star_border';
        }
    }

    onBack() {
        this.router.navigate(['/books']);
    }
    async onSubmitReview() {
        if (this.reviewForm.valid) {
            const newReview = {
                content: this.reviewForm.value.content,
                score: this.rating * 2,
                book_id: this.bookId,
                user_id: this.loggedInUser!._id
            };
            if (!this.uniqueUserIds.includes(this.loggedInUser!._id)) {
                this.bookService.Addreview(newReview).subscribe(async review => {
                    setTimeout(() => {
                        this.fillreviews();
                    }, 1000);
                    this.reviewForm.reset();
                    this.snackBar.open(await firstValueFrom(this.translationService.service.get('BOOKITEM.SNACKBAR.SUBMITTED')), '', {
                        duration: this.snackBarDuration
                    });
                });
            }
            else {
                this.snackBar.open(await firstValueFrom(this.translationService.service.get('BOOKITEM.SNACKBAR.ALREADYSUBMITTED')), '', {
                    duration: this.snackBarDuration
                });
            }
        }
    }

    navigateToCreate() {
        this.router.navigate(['create/summary', this.book._id]);
    }
}
export enum StarRatingColor {
    primary = "primary",
    accent = "accent",
    warn = "warn"
}

