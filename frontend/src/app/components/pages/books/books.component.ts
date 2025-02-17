import { Component } from '@angular/core';
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

}
