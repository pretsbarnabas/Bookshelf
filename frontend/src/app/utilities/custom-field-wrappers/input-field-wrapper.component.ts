import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { BaseFieldWrapper } from './base-field-wrapper.component';

@Component({
    selector: 'input-field-wrapper',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        FormlyMaterialModule,
        CommonModule
    ],
    template: `
        <mat-form-field [appearance]="triggerFillAppearance ? 'fill' : 'outline'" class="w-100 my-1">
          <mat-label>{{ to.label }}</mat-label>
  
          <input
            matInput
            [type]='to.type!'
            [formControl]="formControlAsFormControl"
            [id]="to['id']"
            [placeholder]="to.placeholder!"
          />

          <mat-error *ngIf="field.formControl?.invalid && (field.formControl?.dirty || field.formControl?.touched)">
            <ng-container *ngIf="field.formControl?.errors">
                <span *ngIf="this.field.formControl?.errors">
                    <mat-icon class="error-icon">error_outline</mat-icon>
                    <span [attr.data-cy]="'error-' + to['id']"> {{ field!.validation?.messages?.[getError()!.key] || 'Unknown error' }}</span>
                </span>
            </ng-container>
          </mat-error>

        </mat-form-field>
    `,
    styles: [`
        .error-icon {
            transform: scale(1.2);
        }

    `]
})
export class InputFieldWrapper extends BaseFieldWrapper {

}
