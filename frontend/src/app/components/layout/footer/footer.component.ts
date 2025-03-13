import { Component, ViewEncapsulation } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from "@angular/flex-layout";


@Component({
  selector: 'app-footer',
  imports: [
    MatToolbarModule,
    FlexLayoutModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  encapsulation: ViewEncapsulation.None,
  
})
export class FooterComponent {

}
