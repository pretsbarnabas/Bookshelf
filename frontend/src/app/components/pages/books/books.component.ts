import { Component, ViewEncapsulation } from '@angular/core';
import { BookDisplayComponent } from '../../../utilities/components/book-display/book-display.component';

@Component({
    selector: 'app-books',
    standalone: true,
    imports: [
        BookDisplayComponent
    ],
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BooksComponent {

}