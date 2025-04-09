import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseFieldWrapper } from './base-field-wrapper.component';

@Component({
    selector: 'file-input-field-wrapper',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        FormlyMaterialModule,
        TranslatePipe
    ],
    template: `
    <div class="w-100 my-1">
      <mat-label class="mb-1 d-block">{{ to.label }}</mat-label>

      <div class="d-flex align-items-center gap-2">
        <input
          [id]="to['id']"
          type="file"
          accept="image/*"
          hidden
          (change)="onFileSelected($event)"
          #fileInput
        />

        <button
          mat-flat-button
          type="button"
          (click)="fileInput.click()"
        >
          {{ to['chooseText'] || ('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.BOOK.CHOOSE' | translate) }}
        </button>

        <span *ngIf="selectedFileName; else noFile">
          {{ selectedFileName }}
        </span>
        <ng-template #noFile>
          {{ to['noFileText'] || ('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.BOOK.NOSELECTED' | translate) }}
        </ng-template>
      </div>

      <mat-error *ngIf="field.formControl?.invalid && (field.formControl?.dirty || field.formControl?.touched)">
        <ng-container *ngIf="field.formControl?.errors">
          <span>
            <mat-icon class="error-icon">error_outline</mat-icon>
            <span [attr.data-cy]="'error-' + to['id']"> {{ field!.validation?.messages?.[getError()!.key] || 'Unknown error' }}</span>
          </span>
        </ng-container>
      </mat-error>
    </div>
  `,
    styles: [`
    .error-icon {
      transform: scale(1.2);
      vertical-align: middle;
    }
    .gap-2 {
      gap: 0.5rem;
    }
  `]
})
export class FileInputFieldWrapper extends BaseFieldWrapper {
    selectedFile?: File;
    selectedFileName = '';

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
