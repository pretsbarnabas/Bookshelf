import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

export type CardType = 'toRead' | 'reading' | 'finished' | 'dropped' | 'favorite';

@Component({
    selector: 'book-card',
    standalone: true,
    templateUrl: './book-card.component.html',
    styleUrls: ['./book-card.component.scss'],
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
    ],
    encapsulation: ViewEncapsulation.None
})
export class BookCardComponent {
    // The book object that this card displays.
    @Input() book: any;
    // The type for this card determines which buttons to show.
    // For example, 'toRead' means show mark-as-favorite and delete buttons,
    // 'reading' shows mark-as-favorite and drop buttons,
    // 'finished' shows a toggle button (Favorite/Remove) plus delete,
    // 'dropped' shows start-reading and delete,
    // and 'favorite' shows a single remove button.
    @Input() cardType: CardType = 'toRead';

    // For the finished cards, you might need to know if the book is already favorite.
    @Input() isFavorite: boolean = false;

    // Emitters for the various actions.
    @Output() startReading = new EventEmitter<string>();
    @Output() dropBook = new EventEmitter<string>();
    @Output() finishReading = new EventEmitter<string>();
    @Output() markAsFavorite = new EventEmitter<string>();
    @Output() deleteBook = new EventEmitter<string>();
    @Output() backToRead = new EventEmitter<string>();
    @Output() backToReading = new EventEmitter<string>();

    onStartReading() {
        this.startReading.emit(this.book._id);
    }

    onDropBook() {
        this.dropBook.emit(this.book._id);
    }

    onFinishReading() {
        this.finishReading.emit(this.book._id);
    }

    onMarkAsFavorite() {
        this.markAsFavorite.emit(this.book._id);
    }

    onDeleteBook() {
        this.deleteBook.emit(this.book._id);
    }

    onbackToRead() {
        this.backToRead.emit(this.book._id)
    }

    onbackToReading() {
        this.backToReading.emit(this.book._id)
    }
}
