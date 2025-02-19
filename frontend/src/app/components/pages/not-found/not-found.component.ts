import { Component, ViewEncapsulation } from '@angular/core';
import { FlexLayoutModule } from "@angular/flex-layout";


@Component({
  selector: 'app-not-found',
  imports: [
    FlexLayoutModule
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NotFoundComponent {

}
