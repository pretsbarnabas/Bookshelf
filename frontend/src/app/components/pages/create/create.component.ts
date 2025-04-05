import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormService } from '../../../services/page/form.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatCardModule } from '@angular/material/card';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslationService } from '../../../services/global/translation.service';
import { BookModel, CreateBookModel, isCreateBookModel } from '../../../models/Book';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { BookService } from '../../../services/page/book.service';
import { CreateSummaryModel, isCreateSummaryModel } from '../../../models/Summary';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

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
        MatIconModule,
        MatDividerModule,
    ],
    providers: [DatePipe],
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class CreateComponent {
    private formService = inject(FormService);
    private route = inject(ActivatedRoute);
    private translationService = inject(TranslationService);
    private bookService = inject(BookService);
    private datePipe = inject(DatePipe);

    mode: 'book' | 'summary' = 'book';
    form: FormGroup = new FormGroup({});
    model?: any;
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
        if (this.mode === 'summary') {
            if (!isCreateSummaryModel(this.model))
                this.model = { book_id: '', content: '' }
            this.formService.getCreateFormConfigMapping().then((value) => this.fields = value['summary']);
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

    formatDate(date: any) {
        return this.datePipe.transform(date, 'yyyy');
    }

}
