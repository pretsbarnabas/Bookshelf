import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseFieldWrapper } from './base-field-wrapper.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'textarea-field-wrapper',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        FormlyMaterialModule,
        MatIconModule
    ],
    template: `
    <mat-form-field appearance="outline" class="w-100 my-1">
      <mat-label>{{ to.label }}</mat-label>
      <textarea
        matInput
        [formControl]="formControlAsFormControl"
        [placeholder]="to.placeholder!"
        [id]="to['id']"
        [rows]="to.rows || 3"
      ></textarea>
      <mat-error *ngIf="field.formControl?.invalid && (field.formControl?.dirty || field.formControl?.touched)">
        <ng-container *ngIf="field.formControl?.errors">
          <span>
            <mat-icon class="error-icon">error_outline</mat-icon>
            {{ field.validation?.messages?.[getError()!.key] || 'Unknown error' }}
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
export class TextareaFieldWrapper extends BaseFieldWrapper { }
