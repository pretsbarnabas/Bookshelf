import { Component, ElementRef, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../services/global/auth.service';
import { UserModel } from '../../../models/User';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizedDatePipe } from '../../../pipes/date.pipe';
import { CommonModule, DatePipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { CustomPaginatorComponent } from "../../../utilities/components/custom-paginator/custom-paginator.component";
import { animate, style, transition, trigger } from '@angular/animations';
import { PaginatedArray } from '../../../models/PaginatedArray';
import { BookService } from '../../../services/page/book.service';
import { ReviewService } from '../../../services/page/review.service';
import { SummaryService } from '../../../services/page/summary.service';
import { CommentService } from '../../../services/page/comment.service';
import { ExpansionItemComponent } from '../admin/expansion-item/expansion-item.component';
import { HttpErrorResponse } from '@angular/common/http';
import { SortItems } from '../../../utilities/components/sort-items';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        MatCardModule,
        TranslatePipe,
        CommonModule,
        LocalizedDatePipe,
        FlexLayoutModule,
        MatIconModule,
        MatButtonModule,
        MatTabsModule,
        CustomPaginatorComponent,
        ExpansionItemComponent
    ],
    providers: [DatePipe],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    encapsulation: ViewEncapsulation.None
})

export class ProfileComponent {
    private bookService = inject(BookService);
    private reviewService = inject(ReviewService);
    private summaryService = inject(SummaryService);
    private commentService = inject(CommentService);
    private authService = inject(AuthService);

    constructor(
    ) {

    }

    loggedInUser: UserModel | null = null;
    roleDataHead: string = "";

    fetchedArray: PaginatedArray = [];
    currentArrayInPaginator: PaginatedArray = [];
    itemType: 'user' | 'book' | 'review' | 'summary' | 'comment' = 'user';
    currentSortSettings: { field: string, mode: 'asc' | 'desc' } = { field: '', mode: 'asc' }

    maxPages: number = 0;
    currentPageIndex = 0;
    pageSize: number = 10;

    errorMessages: HttpErrorResponse[] = [];
    @ViewChild('errorAlert', { static: false }) errorAlert!: ElementRef;

    ngOnInit() {
        this.authService.loggedInUser$.subscribe(user => {
            this.loggedInUser = user;
            this.roleDataHead = `PROFILE.PROFILECARD.ROLETABLE.${user?.role.toLocaleUpperCase()}`;
        });
    }
    private fetchMapping = {
        0: {
            fn: () => this.bookService.getAllBooks(this.pageSize, this.currentPageIndex) as any,
            type: 'book' as const
        },
        1: {
            fn: () => this.reviewService.getAllReviews(this.pageSize, this.currentPageIndex) as any,
            type: 'review' as const
        },
        2: {
            fn: () => this.summaryService.getAllSummaries(this.pageSize, this.currentPageIndex) as any,
            type: 'summary' as const
        },
        3: {
            fn: () => this.commentService.getAllcomments(this.pageSize, this.currentPageIndex) as any,
            type: 'comment' as const
        }
    };

    private fetchItems(arrayKey: '0' | '1' | '2' | '3'): void {
        this.fetchMapping[arrayKey].fn().subscribe({
            next: (data: any) => {
                this.fetchedArray = data.data
                this.itemType = this.fetchMapping[arrayKey].type;
                this.sortItems(this.currentSortSettings)
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

    onTabChange(event: MatTabChangeEvent) {
        this.fetchItems((event.index.toString() as '0' | '1' | '2' | '3'))
        console.log(this.fetchedArray)
    }

    changePage(changes: { pageIndex: number; pageSize: number }): void {
    }

    sortItems(_settings: { field: string, mode: 'asc' | 'desc' }): void {
        if (_settings.field === '') {
            this.currentArrayInPaginator = structuredClone(this.fetchedArray);
            return;
        }
        this.currentSortSettings = _settings;
        this.currentArrayInPaginator = structuredClone(this.fetchedArray);
        this.currentArrayInPaginator = SortItems.generalizedSort(this.currentArrayInPaginator as any[], _settings.field, _settings.mode);
    }

    handleDialogRequest(requestParams: { dialogType: 'delete' | 'edit'; item: { type: 'user' | 'book' | 'review' | 'summary' | 'comment'; _id: string }, modifiedItem?: any }): void {

    }
}
