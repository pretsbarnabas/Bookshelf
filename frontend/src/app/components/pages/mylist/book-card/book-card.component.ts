import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'book-card',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './book-card.component.html',
    styleUrls: ['./book-card.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BookCardComponent {
    @Input() book: any;
    @Input() action: 'dropped' | 'favorite' = 'dropped';
    @Output() startReading = new EventEmitter<string>();
    @Output() deleteBook = new EventEmitter<string>();
    @Output() finishReading = new EventEmitter<string>();

    onStartReading(bookId: string) {
        this.startReading.emit(bookId);
    }

    onDeleteBook(bookId: string) {
        this.deleteBook.emit(bookId);
    }

    onFinishReading(bookId: string) {
        this.finishReading.emit(bookId);
    }
}
