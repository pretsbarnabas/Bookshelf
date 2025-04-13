import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

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
        MatTooltipModule,
        TranslatePipe
    ],
    encapsulation: ViewEncapsulation.None
})
export class BookCardComponent {
    @Input() book: any;
    @Input() cardType: CardType = 'toRead';
    @Input() isFavorite: boolean = false;

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
