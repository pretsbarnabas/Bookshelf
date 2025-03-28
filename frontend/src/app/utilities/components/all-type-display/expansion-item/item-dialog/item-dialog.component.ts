import { Component, Inject, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule, NativeDateAdapter } from '@angular/material/core';
import { EditDialogFieldConfig, FormService } from '../../../../../services/page/form.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslationService } from '../../../../../services/global/translation.service';

@Component({
    selector: 'app-item-dialog',
    imports: [
        MatDialogModule,
        MatButtonModule,
        CommonModule,
        TranslatePipe,
        MatFormFieldModule,
        MatInputModule,
        FormlyMaterialModule,
        ReactiveFormsModule,
        MatOptionModule,
        MatDatepickerModule,
        MatNativeDateModule,
    ],
    templateUrl: './item-dialog.component.html',
    styleUrl: './item-dialog.component.scss',
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: DateAdapter, useClass: NativeDateAdapter },
        { provide: MAT_DATE_LOCALE, useValue: 'en' }
    ]
})
export class ItemDialogComponent {
    data = inject(MAT_DIALOG_DATA)
    private formService = inject(FormService);
    private dialogRef = inject(MatDialogRef<ItemDialogComponent>)
    private fb = inject(FormBuilder);

    private translationService = inject(TranslationService);
    private dateAdapter = inject(DateAdapter<NativeDateAdapter>);
    @Inject(MAT_DATE_LOCALE) private locale: string = 'en';

    constructor() {
        this.translationService.currentLanguage$.subscribe((lang)=>{
            this.dateAdapter.setLocale(lang);
        })
    }

    form: FormGroup = new FormGroup({});
    config?: EditDialogFieldConfig[];

    selectedFile?: File;
    selectedFileName: string = '';

    async ngOnInit() {
        const itemType = this.data.item.type;
        const allConfigs = await this.formService.getEditDialogFormConfigMapping();

        this.config = allConfigs[itemType] || [];

        this.form = this.fb.group({});

        this.config.forEach(field => {
            let initialValue = this.data.item[field.name] || '';

            if (field.transformInput) {
                initialValue = field.transformInput(initialValue);
            }

            this.form.addControl(
                field.name,
                this.fb.control(initialValue, field.validators || [])
            );
            this.form.get(field.name)?.patchValue(initialValue);
        });
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
            };
            reader.readAsDataURL(this.selectedFile);
        }
    }

    saveModification() {
        if (this.form.valid) {

            const releaseFieldConfig = this.config!.find(field => field.name === 'release');
            if (releaseFieldConfig && releaseFieldConfig.transformOutput) {              
                this.form.controls['release'].setValue(releaseFieldConfig.transformOutput(this.form.controls['release'].value));              
            }

            const formData = new FormData();
            Object.keys(this.form.value).forEach((key) => {
                formData.append(key, this.form.value[key]);
            });

            if (this.selectedFile) {
                formData.append('imageFile', this.selectedFile);
            }          
            this.emitResult({ result: true, modifiedData: { ...this.form.value } });
        }
        // console.log(this.form.controls)
        // console.log({ ...this.data.item, ...this.form.value })
    }

    emitResult(result: any) {
        this.dialogRef.close(result);
    }

    getErrorKeys(fieldName: string): string[] {
        const control = this.form.controls[fieldName];
        return control.errors ? Object.keys(control.errors) : [];
    }
}
