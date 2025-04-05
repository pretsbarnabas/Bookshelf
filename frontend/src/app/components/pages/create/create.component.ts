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

@Component({
    selector: 'app-create',
    imports: [
        MatCardModule,
        CommonModule,
        TranslatePipe,
        FormlyModule,
        FormlyMaterialModule,
        MatFormFieldModule,
        MatInputModule,
        FormlyMaterialModule,
        ReactiveFormsModule,
        MatOptionModule,
        MatDatepickerModule,
        MatNativeDateModule,
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


    mode: 'book' | 'summary' = 'book';
    form: FormGroup = new FormGroup({});
    model: any;
    fields: FormlyFieldConfig[] = [];

    selectedFile?: File;
    selectedFileName: string = '';
    imgBase64: string | ArrayBuffer | null = '';

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
            this.formService.getCreateFormConfigMapping().then((value) => this.fields = value['book']);
        }
    }

    getErrorKeys(fieldName: string): string[] {
        const control = this.form.controls[fieldName];
        return control.errors ? Object.keys(control.errors) : [];
    }

    triggerFileInput() {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        fileInput.click();
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
            this.selectedFileName = this.selectedFile.name;

            const reader = new FileReader();
            reader.onload = () => {
                this.form.patchValue({ image: reader.result });
                this.imgBase64 = reader.result;
            };
            reader.readAsDataURL(this.selectedFile);
        }
    }

}
