import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { BaseFieldWrapper } from './base-field-wrapper.component';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'select-field-wrapper',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        FormlyMaterialModule,
    ],
    template: `
    <mat-form-field [appearance]="triggerFillAppearance ? 'fill' : 'outline'" class="w-100 my-1">
      <mat-label>{{ to.label }}</mat-label>

      <mat-select
        [formControl]="formControlAsFormControl"
        [id]="to['id']"
        [placeholder]="to.placeholder!"
      >
      <mat-option *ngFor="let option of options$ | async" [value]="option.value">
          {{ option.label }}
        </mat-option>
      </mat-select>

      <mat-error *ngIf="field.formControl?.invalid && (field.formControl?.dirty || field.formControl?.touched)">
        <ng-container *ngIf="field.formControl?.errors">
          <mat-icon class="error-icon">error_outline</mat-icon>
          {{ field!.validation?.messages?.[getError()!.key] || 'Unknown error' }}
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
export class SelectFieldWrapper extends BaseFieldWrapper {

    override ngOnInit() {
        super.ngOnInit?.();

        if (this.formControl && !this.formControl.value) {
            this.formControl.setValue(this.to['defaultValue'] ?? 'None');
        }
    }


    get options$() {
        const opts = this.to?.options;
        return opts instanceof Observable ? opts : of(opts ?? []);
    }
}
