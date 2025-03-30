import { Component, Renderer2, ElementRef, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
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
import { BookModel } from '../../../models/Book';
import { CustomPaginatorComponent } from '../../../utilities/components/custom-paginator/custom-paginator.component';

@Component({
    selector: 'app-books',
    standalone: true,
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
        CustomPaginatorComponent
    ],
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.scss'],
    providers: [DatePipe],
    encapsulation: ViewEncapsulation.None,
})
export class BooksComponent implements OnInit {
    @ViewChild('container') container!: ElementRef;
    @ViewChild('showMoreButton') showMoreButton!: ElementRef;

    maxPages: number = 0;
    currentPageIndex = 0;
    pageSize = 10;

    books: BookModel[] = [];

    constructor(private renderer: Renderer2, private bookService: BookService, private datePipe: DatePipe, private router: Router) { }

    ngOnInit() {
        this.getBooks();
    }

    getBooks() {
        this.bookService.getAllBooks(this.pageSize, this.currentPageIndex).subscribe({
            next: (data) => {
                this.books = data.data;
                console.log(this.books)
                this.maxPages = data.pages;                ;
            },
            error: (err) => {
                console.error('Error fetching books', err);
            }
        });
    }

    changePage(changes: { pageIndex: number; pageSize: number }) {
        this.currentPageIndex = changes.pageIndex;
        this.pageSize = changes.pageSize;
        this.getBooks();
    }

    navigateToBook(bookId: string) {
        this.router.navigate(['/book-item', bookId]);
    }

    formatDate(date: any) {
        return this.datePipe.transform(date, 'yyyy');
    }
}