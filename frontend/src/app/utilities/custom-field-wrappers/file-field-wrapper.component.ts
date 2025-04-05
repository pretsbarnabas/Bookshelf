import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseFieldWrapper } from './base-field-wrapper.component';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'file-input-field-wrapper',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        MatInputModule,
        ReactiveFormsModule,
        FormlyMaterialModule,
        CommonModule,
        TranslatePipe
    ],
    template: `
    <mat-form-field appearance="outline" class="w-100 my-1">
      <mat-label>{{ to.label }}</mat-label>
      <ng-container class="d-flex align-items-center">
        <input
        matInput
          [id]="to['id']"
          type="file"
          accept="image/*"
          hidden
          (change)="onFileSelected($event)"
        />
        <button
          mat-flat-button
          type="button"
          class="me-2"
          (click)="triggerFileInput()"
        >
          {{ to['chooseText'] || ('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.BOOK.CHOOSE' | translate) }}
        </button>
        <span *ngIf="selectedFileName; else noFile">
          {{ selectedFileName }}
        </span>
        <ng-template #noFile>
          {{ to['noFileText'] || ('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.BOOK.NOSELECTED' | translate) }}
        </ng-template>
      </ng-container>
      <mat-error *ngIf="field.formControl?.invalid && (field.formControl?.dirty || field.formControl?.touched)">
            <ng-container *ngIf="field.formControl?.errors">
                <span *ngIf="this.field.formControl?.errors">
                    <mat-icon class="error-icon">error_outline</mat-icon>
                    {{ field!.validation?.messages?.[getError()!.key] || 'Unknown error' }}
                </span>
            </ng-container>
          </mat-error>
    </mat-form-field>
  `,
    styles: [`
    .error-icon {
      transform: scale(1.2);
      vertical-align: middle;
    }
  `]
})
export class FileInputFieldWrapper extends BaseFieldWrapper {
    selectedFile?: File;
    selectedFileName: string = '';

    triggerFileInput() {
        const fileInput = document.getElementById(this.to['id']) as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
            this.selectedFileName = this.selectedFile.name;

            const reader = new FileReader();
            reader.onload = () => {
                this.field.formControl?.setValue(reader.result);
            };
            reader.readAsDataURL(this.selectedFile);
        }
    }
}
