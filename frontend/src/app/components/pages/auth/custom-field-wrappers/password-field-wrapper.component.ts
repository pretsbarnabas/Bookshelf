import { Component, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FieldWrapper } from '@ngx-formly/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyMaterialModule } from '@ngx-formly/material';

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
                    {{ field!.validation?.messages?.[getError()!.key] || 'Unknown error' }}
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
export class PasswordFieldWrapper extends FieldWrapper {
    isPasswordVisible: boolean = false;
    triggerFillAppearance: boolean = false;

    get formControlAsFormControl(): FormControl {
        return this.formControl as FormControl;
    }

    togglePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    getError() {
        const errors = this.field.formControl?.errors;
        if (errors) {
            const errorKeys = Object.keys(errors);
            const lastErrorKey = errorKeys[0];
            return { key: lastErrorKey, value: errors[lastErrorKey] };
        }
        return null;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.checkWindowWidth();
    }

    ngOnInit() {
        this.checkWindowWidth();
    }

    private checkWindowWidth() {
        this.triggerFillAppearance = window.innerWidth < 767;
    }
}
