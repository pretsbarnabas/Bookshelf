import { Component, inject, ViewEncapsulation } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BookService } from '../../../services/page/book.service';
import { BookModel } from '../../../models/Book';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../../services/global/auth.service';
import { UserModel } from '../../../models/User';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SummaryService } from '../../../services/page/summary.service';
import { SummaryModel } from '../../../models/Summary';
import { LocalizedDatePipe } from "../../../pipes/date.pipe";
import { RelativeTimePipe } from "../../../pipes/relative-time.pipe";

@Component({
    selector: 'app-home',
    imports: [
    TranslatePipe,
    MatCardModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatExpansionModule,
    MatSidenavModule,
    MatDividerModule,
    MatTooltipModule,
    LocalizedDatePipe,
    RelativeTimePipe
],
    providers: [DatePipe],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('fadeInUp', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(20px)' }),
                animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ])
    ]
})
export class HomeComponent {
    private summaryService = inject(SummaryService);
    constructor(private bookService: BookService, private router: Router, private datePipe: DatePipe, private authService: AuthService) { }
    books: BookModel[] = [];
    summaries: SummaryModel[] = [];
    loggedInUser: UserModel | null = null;
    isMdOrBeyond: boolean = true;

    ngOnInit(): void {
        this.authService.loggedInUser$.subscribe(user => {
            this.loggedInUser = user;
        });
        this.getBooks();
        this.getsummaries();
    }
    navigateTo(route: string): void {
        this.router.navigate([route]);
    }
    getBooks(): void {
        this.bookService.getAllBooks(4, 0, undefined, 'added_at', 'desc').subscribe({
            next: (data) => {
                this.books = data.data;
            }
        });
    }

    getsummaries(): void {
        this.summaryService.getAllSummaries(4, 0).subscribe({
            next: (data) => {
                this.summaries = data.data;
            }
        });
    }

    navigateToBook(bookId: string) {
        this.router.navigate(['/book-item', bookId]);
    }

    navigateToSummary(summaryId: string | number) {
        this.router.navigate(['/summary-item', summaryId]);
    }

    formatDate(date: any) {
        return this.datePipe.transform(date, 'yyyy');
    }

}
