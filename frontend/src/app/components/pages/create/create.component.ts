import { Component, inject, ViewEncapsulation } from '@angular/core';
import { EditDialogFieldConfig, FormService } from '../../../services/page/form.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslationService } from '../../../services/global/translation.service';
import { BookModel, CreateBookModel, isCreateBookModel } from '../../../models/Book';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { BookService } from '../../../services/page/book.service';

@Component({
    selector: 'app-create',
    imports: [
        MatCardModule,
        CommonModule,
        TranslatePipe,
        FormlyModule,
        FormlyMaterialModule,
        ReactiveFormsModule,
        MatButtonModule,
    ],
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class CreateComponent {
    private formService = inject(FormService);
    private route = inject(ActivatedRoute);
    private fb = inject(FormBuilder);
    private translationService = inject(TranslationService);
    private bookService = inject(BookService);
    


    mode: 'book' | 'summary' = 'book';
    form: FormGroup = new FormGroup({});
    model?: CreateBookModel;
    fields: FormlyFieldConfig[] = [];

    errorMessages: HttpErrorResponse[] = [];    

    async ngOnInit() {
        this.route.url.subscribe((segments) => {
            const childRoute = segments[0]?.path;
            if (childRoute === 'book')
                this.mode = 'book';
            else
                this.mode = 'summary';
            this.getForm();
        });
        this.translationService.currentLanguage$.subscribe((lang) => {
            this.getForm();
        });
    }

    getForm() {
        if (this.mode === 'book') {
            if (!isCreateBookModel(this.model))
                this.model = { title: '', author: '', release: '', genre: '', description: '', image: '' } as CreateBookModel;
            this.formService.getCreateFormConfigMapping().then((value) => this.fields = value['book']);
        }
    }    

    onSubmit() {
        this.errorMessages = [];
        console.log(this.model as CreateBookModel);
        this.bookService.createBook(this.model as CreateBookModel).subscribe({
            next: (response: BookModel) => {
                console.log(response);                
            },
            error: (error: HttpErrorResponse) => {                
                this.errorMessages.push(error as HttpErrorResponse);
            }
        });
    }

}
