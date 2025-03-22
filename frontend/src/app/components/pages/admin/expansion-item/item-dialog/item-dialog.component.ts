import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserModel } from '../../../../../models/User';
import { Book } from '../../../../../models/Book';
import { ReviewModel } from '../../../../../models/Review';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatOptionModule } from '@angular/material/core';
import { EditDialogFieldConfig, editDialogFormConfigMapping } from '../../../../../services/page/form.service';

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
        MatOptionModule
    ],
    templateUrl: './item-dialog.component.html',
    styleUrl: './item-dialog.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class ItemDialogComponent {
    data = inject(MAT_DIALOG_DATA)
    private dialogRef = inject(MatDialogRef<ItemDialogComponent>)
    private fb = inject(FormBuilder);

    form: FormGroup = new FormGroup({});
    config?: EditDialogFieldConfig[];

    ngOnInit() {
        const itemType = this.data.item.type;
        this.config = editDialogFormConfigMapping[itemType] || [];
        this.form = this.fb.group({});

        this.config.forEach(field => {
            this.form.addControl(
                field.name,
                this.fb.control(this.data.item[field.name] || '', field.validators || [])
            );
        });
    }

    saveModification() {
        if (this.form.valid) {
            this.emitResult({ result: true, modifiedData: { ...this.data.item, ...this.form.value } });
        }
        console.log({ ...this.data.item, ...this.form.value })
    }

    emitResult(result: any) {
        this.dialogRef.close(result);
    }

    getErrorKeys(fieldName: string): string[] {
        const control = this.form.controls[fieldName];
        return control.errors ? Object.keys(control.errors) : [];
    }
}
