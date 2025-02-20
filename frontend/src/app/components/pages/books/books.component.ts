import { Component, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormlyModule } from '@ngx-formly/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-books',
  imports: [        
    FormlyModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormlyMaterialModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent {
  @ViewChild('container') container!: ElementRef;
  @ViewChild('showMoreButton') showMoreButton!: ElementRef;


  constructor(private renderer: Renderer2) {}
  isExpanded = false;
  showMore() {
    if (!this.isExpanded) {
      const containerEl = this.container.nativeElement;
      const buttonEl = this.showMoreButton.nativeElement;
      this.renderer.setStyle(containerEl, 'height', '700px');
      this.renderer.setStyle(buttonEl, 'transform', 'scaleY(-1)');
      this.isExpanded = true;      
    } else {
      const containerEl = this.container.nativeElement;
      const buttonEl = this.showMoreButton.nativeElement;
      this.renderer.setStyle(containerEl, 'height', '10vh');
      this.renderer.setStyle(buttonEl, 'transform', 'scaleY(1)');
      this.isExpanded = false;
    }
  }

}
