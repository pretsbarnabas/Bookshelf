import { Component, ElementRef, ViewChild, OnInit, ViewEncapsulation, inject, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { FormlyModule } from '@ngx-formly/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookService } from '../../../services/page/book.service';
import { CommonModule, DatePipe } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { BookModel } from '../../../models/Book';

import { CustomPaginatorComponent } from '../../../utilities/components/custom-paginator/custom-paginator.component';
import { TranslatePipe } from '@ngx-translate/core';
import { SortItems } from '../../../utilities/components/sort-items';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { map } from 'rxjs/internal/operators/map';
import { UserModel } from '../../../models/User';
import { AuthService } from '../../../services/global/auth.service';
import { SummaryService } from '../../../services/page/summary.service';
import { SummaryModel } from '../../../models/Summary';
import { LocalizedDatePipe } from "../../../pipes/date.pipe";
import { NavigationStateService } from '../../../services/global/navigation-state.service';

@Component({
    selector: 'book-display',
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
    CustomPaginatorComponent,
    FormsModule,
    TranslatePipe,
    MatDividerModule,
    RouterModule,
    MatTooltipModule,
    LocalizedDatePipe
],
    templateUrl: './book-display.component.html',
    styleUrl: './book-display.component.scss',
    providers: [DatePipe],
    encapsulation: ViewEncapsulation.None,

})
export class BookDisplayComponent {
    private mediaObserver = inject(MediaObserver);
    private authService = inject(AuthService);
    private summaryService = inject(SummaryService);
    private navService = inject(NavigationStateService);
    @Input() mode?: 'books' | 'summaries';

    @ViewChild('container') container!: ElementRef;
    @ViewChild('showMoreButton') showMoreButton!: ElementRef;

    isMdOrBeyond: boolean = false;
    user: UserModel | null = null;

    maxPages: number = 1;
    currentPageIndex = 0;
    pageSize = 10;

    books: BookModel[] = [];
    summaries: SummaryModel[] = [];
    filteredBooks: BookModel[] = [];
    filteredSummaries: SummaryModel[] = [];
    searchTerm: string = '';

    constructor(private bookService: BookService, private datePipe: DatePipe, private router: Router) { }

    ngOnInit() {
        this.fetchItems();
        this.mediaObserver.asObservable().pipe(
            map((changes: MediaChange[]) => {
                const isMdOrBeyond = changes.some(change => ['md', 'lg', 'xl'].includes(change.mqAlias));
                this.isMdOrBeyond = isMdOrBeyond;
            })
        ).subscribe();
        this.authService.loggedInUser$.subscribe((user) => {
            this.user = user;
        });
    }

    filterBooks(): void {
        if (this.mode === 'books') {
            this.filteredBooks = this.books!.filter(book =>
                book.title.toLowerCase().startsWith(this.searchTerm.toLowerCase())
            );
        }
        if (this.mode === 'summaries') {
            this.filteredSummaries = this.summaries.filter(s =>
                s.book.title.toLowerCase().startsWith(this.searchTerm.toLowerCase())
            );
        }
    }

    fetchItems() {
        if (this.mode === 'books') {
            this.bookService.getAllBooks(this.pageSize, this.currentPageIndex).subscribe({
                next: (data) => {
                    this.books = data.data;
                    this.filteredBooks = this.books;
                    this.maxPages = data.pages;
                },
                error: (err) => {
                    console.error('Error fetching books', err);
                }
            });
        }
        if (this.mode === 'summaries') {
            this.summaryService.getAllSummaries(this.pageSize, this.currentPageIndex).subscribe({
                next: (data) => {
                    this.summaries = data.data;
                    this.filteredSummaries = this.summaries;
                    this.maxPages = data.pages;
                },
                error: (err) => {
                    console.error('Error fetching books', err);
                }
            });
        }
    }

    changePage(changes: { pageIndex: number; pageSize: number }) {
        this.currentPageIndex = changes.pageIndex;
        this.pageSize = changes.pageSize;
        this.fetchItems();
    }

    navigateToBook(_id: string) {
        if (this.mode === 'books'){
            this.navService.setState('/book-item', _id, '');
            this.router.navigate(['/book-item']);
        }
        if (this.mode === 'summaries'){
            this.navService.setState('/summary-item', _id, '');
            this.router.navigate(['/summary-item']);
        }
    }

    formatDate(date: any) {
        return this.datePipe.transform(date, 'yyyy');
    }

    sortItems(_settings: { field: string, mode: 'asc' | 'desc' }): void {
        if(this.mode === 'books'){
            if (_settings.field === '') {
                this.filteredBooks = structuredClone(this.books);
                return;
            }
            this.filteredBooks = structuredClone(this.books);
            this.filteredBooks = SortItems.generalizedSort(this.filteredBooks as any[], _settings.field, _settings.mode);
        }
    }

    navigateToCreate() {
        if (this.mode === 'books')
            this.router.navigate(['/create/book']);
        if (this.mode === 'summaries')
            this.router.navigate(['/create/summary']);
    }
}
