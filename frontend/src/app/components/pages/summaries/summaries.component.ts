import { Component, ViewEncapsulation } from '@angular/core';
import { BookDisplayComponent } from "../../../utilities/components/book-display/book-display.component";

@Component({
  selector: 'app-summaries',
  imports: [BookDisplayComponent],
  templateUrl: './summaries.component.html',
  styleUrl: './summaries.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SummariesComponent {

}
