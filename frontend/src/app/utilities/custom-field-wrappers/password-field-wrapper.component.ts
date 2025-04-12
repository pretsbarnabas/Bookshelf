import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { BaseFieldWrapper } from './base-field-wrapper.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'password-field-wrapper',
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
            [type]="isPasswordVisible ? 'text' : 'password'"
            [formControl]="formControlAsFormControl"
            [id]="to['id']"
            [placeholder]="to.placeholder!"
          />
  
          <button mat-icon-button matSuffix type="button" (click)="togglePasswordVisibility()">
            <mat-icon>{{ isPasswordVisible ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>

          <mat-error *ngIf="field.formControl?.invalid && (field.formControl?.dirty || field.formControl?.touched)">
            <ng-container *ngIf="field.formControl?.errors">
                <span *ngIf="getError()">
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
export class PasswordFieldWrapper extends BaseFieldWrapper {
    isPasswordVisible: boolean = false;

    togglePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible;
    }
}
