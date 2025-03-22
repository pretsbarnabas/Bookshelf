import {
    Component,
    ElementRef,
    inject,
    ViewChild,
    ViewEncapsulation,
    OnInit
} from '@angular/core';
import { BookService } from '../../../services/page/book.service';
import { ReviewService } from '../../../services/page/review.service';
import { Book } from '../../../models/Book';
import { ReviewModel } from '../../../models/Review';
import { UserModel } from '../../../models/User';
import { UserService } from '../../../services/page/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { ExpansionItemComponent } from './expansion-item/expansion-item.component';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomPaginatorComponent } from '../../../utilities/components/custom-paginator/custom-paginator.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslationService } from '../../../services/global/translation.service';
import { firstValueFrom } from 'rxjs';
import { SummaryService } from '../../../services/page/summary.service';
import { CommentService } from '../../../services/page/comment.service';
import { CommentModel } from '../../../models/Comment';
import { SummaryModel } from '../../../models/Summary';

type PaginatedArray = UserModel[] | Book[] | ReviewModel[] | SummaryModel[] | CommentModel[];

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
    styleUrls: ['./admin.component.scss'],
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
export class AdminComponent implements OnInit {
    private userService = inject(UserService);
    private bookService = inject(BookService);
    private reviewService = inject(ReviewService);
    private summaryService = inject(SummaryService);
    private commentService = inject(CommentService);
    private translationService = inject(TranslationService);
    private snackBar = inject(MatSnackBar);

    currentArrayInPaginator: PaginatedArray = [];
    itemType: 'user' | 'book' | 'review' | 'summary' | 'comment' = 'user';

    disabledButton: 'users' | 'books' | 'reviews' | 'summaries' | 'comments' = 'users';
    animate: boolean = false;

    maxPages: number = 0;
    currentPageIndex = 0;
    pageSize: number = 10;

    users: UserModel[] = [];
    books: Book[] = [];
    reviews: ReviewModel[] = [];
    summaries: SummaryModel[] = [];
    comments: CommentModel[] = [];

    errorMessages: HttpErrorResponse[] = [];
    @ViewChild('errorAlert', { static: false }) errorAlert!: ElementRef;

    private fetchMapping = {
        users: {
            fn: () => this.userService.getAllUser(this.pageSize, this.currentPageIndex) as any,
            type: 'user' as const
        },
        books: {
            fn: () => this.bookService.getAllBooks(this.pageSize, this.currentPageIndex) as any,
            type: 'book' as const
        },
        reviews: {
            fn: () => this.reviewService.getAllReviews(this.pageSize, this.currentPageIndex) as any,
            type: 'review' as const
        },
        summaries: {
            fn: () => this.summaryService.getAllSummaries(this.pageSize, this.currentPageIndex) as any,
            type: 'summary' as const
        },
        comments: {
            fn: () => this.commentService.getAllcomments(this.pageSize, this.currentPageIndex) as any,
            type: 'comment' as const
        }
    };

    private deleteMapping = {
        user: {
            fn: (id: string) => this.userService.deleteUser(id),
            paginatorKey: 'users' as const
        },
        book: {
            fn: (id: string) => this.bookService.deleteBook(id),
            paginatorKey: 'books' as const
        },
        review: {
            fn: (id: string) => this.reviewService.deleteReview(id),
            paginatorKey: 'reviews' as const
        },
        summary: {
            fn: (id: string) => this.summaryService.deleteSummary(id),
            paginatorKey: 'summaries' as const
        },
        comment: {
            fn: (id: string) => this.commentService.deleteComment(id),
            paginatorKey: 'comments' as const
        }
    };

    private updateMapping = {
        book: {
            fn: (id: number | string, item: Book) => this.bookService.updateBook(id, item),
            paginatorKey: 'books' as const
        },
        review: {
            fn: (id: number | string, item: ReviewModel) => this.reviewService.updateReview(id, item),
            paginatorKey: 'reviews' as const
        },
        summary: {
            fn: (id: number | string, item: SummaryModel) => this.summaryService.updateSummary(id, item),
            paginatorKey: 'summaries' as const
        },
        comment: {
            fn: (id: number | string, item: CommentModel) => this.commentService.updateComment(id, item),
            paginatorKey: 'comments' as const
        }
    };

    constructor() { }

    ngOnInit() {
        this.changePaginatedArray(this.disabledButton);
    }

    changePaginatedArray(arrayKey: 'users' | 'books' | 'reviews' | 'summaries' | 'comments'): void {
        this.errorMessages = [];
        if (this.disabledButton !== arrayKey) {
            this.currentPageIndex = 0;
        }
        this.disabledButton = arrayKey;
        this.fetchItems(arrayKey);
        this.animate = !this.animate;
    }

    private fetchItems(arrayKey: 'users' | 'books' | 'reviews' | 'summaries' | 'comments'): void {
        this.fetchMapping[arrayKey].fn().subscribe({
            next: (data: any) => {
                if (arrayKey === 'users') {
                    this.users = data.data;
                    this.currentArrayInPaginator = this.users;
                } else if (arrayKey === 'books') {
                    this.books = data.data;
                    this.currentArrayInPaginator = this.books;
                } else if (arrayKey === 'reviews') {
                    this.reviews = data.data;
                    this.currentArrayInPaginator = this.reviews;
                } else if (arrayKey === 'summaries') {
                    this.summaries = data.data;
                    this.currentArrayInPaginator = this.summaries;
                } else if (arrayKey === 'comments') {
                    this.comments = data.data;
                    this.currentArrayInPaginator = this.comments;
                }
                this.itemType = this.fetchMapping[arrayKey].type;
                this.maxPages = data.pages;
            },
            error: (err: HttpErrorResponse) => {
                if (err.status === 404) {
                    this.currentPageIndex = 0;
                    return;
                }
                this.onError(err);
            }
        });
    }

    private onError(error: HttpErrorResponse): void {
        this.errorMessages.push(error);
        setTimeout(() => {
            this.errorAlert.nativeElement.scrollIntoView({ behavior: 'smooth' });
        });
    }

    changePage(changes: { pageIndex: number; pageSize: number }): void {
        this.currentPageIndex = changes.pageIndex;
        this.pageSize = changes.pageSize;
        this.changePaginatedArray(this.disabledButton);
    }

    async handleDialogRequest(requestParams: { dialogType: 'delete' | 'edit'; item: { type: 'user' | 'book' | 'review' | 'summary' | 'comment'; _id: string }, modifiedItem?: any }): Promise<void> {
        if (requestParams.dialogType === 'delete') {
            if (!requestParams.item?.type)
                return;
            const mapping = this.deleteMapping[requestParams.item.type];
            if (!mapping) {
                return;
            }
            mapping.fn(requestParams.item as any).subscribe({
                next: async (response: { message: string }) => {
                    await this.showDialogSnackbar('ADMIN.SNACKBAR.DELETED');
                    setTimeout(() => {
                        this.changePaginatedArray(mapping.paginatorKey);
                    }, 250);
                },
                error: (err: HttpErrorResponse) => this.onError(err)
            });
        }
        if (requestParams.dialogType === 'edit' && requestParams.modifiedItem && requestParams.item?.type !== 'user') {
            const mapping = this.updateMapping[requestParams.item.type];
            if (!mapping) {
                return;
            }
            console.log(requestParams)
            console.log(mapping)
            mapping.fn(requestParams.item._id, (requestParams.modifiedItem as any)).subscribe({
                next: async (response) => {
                    await this.showDialogSnackbar('ADMIN.SNACKBAR.UPDATED');
                    setTimeout(() => {
                        this.changePaginatedArray(mapping.paginatorKey);
                    }, 250);
                },
                error: (err: HttpErrorResponse) => this.onError(err)
            });
        }
    }

    async showDialogSnackbar(snackbarLabel: string): Promise<void> {
        const message = await firstValueFrom(this.translationService.service.get(snackbarLabel));
        const action = await firstValueFrom(this.translationService.service.get('ADMIN.SNACKBAR.CLOSE'));
        this.snackBar.open(`${message}`, action, {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000
        });
    }
}
