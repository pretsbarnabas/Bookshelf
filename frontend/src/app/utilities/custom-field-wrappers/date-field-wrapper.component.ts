import { Component, Inject, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseFieldWrapper } from './base-field-wrapper.component';
import { TranslationService } from '../../services/global/translation.service';

@Component({
    selector: 'date-field-wrapper',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        CommonModule,
        ReactiveFormsModule,
    ],
    template: `
    <mat-form-field [appearance]="triggerFillAppearance ? 'fill' : 'outline'" class="w-100 my-1">
      <mat-label>{{ to.label }}</mat-label>
      <input
        matInput
        [matDatepicker]="picker"
        [formControl]="formControlAsFormControl"
        [placeholder]="to.placeholder!"
        [id]="to['id']"
      />
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
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
export class DateFieldWrapper extends BaseFieldWrapper {
    private translationService = inject(TranslationService);
    private dateAdapter = inject(DateAdapter<NativeDateAdapter>);
    @Inject(MAT_DATE_LOCALE) private locale: string = 'en';

    constructor() {
        super();
        this.translationService.currentLanguage$.subscribe((lang) => {
            this.dateAdapter.setLocale(lang);
        })
    }
    override ngOnInit() {
        const val = this.field.formControl!.value;
        if (val && typeof val === 'string') {
            const parsedDate = new Date(val);
            if (!isNaN(parsedDate.getTime())) {
                this.field.formControl!.setValue(parsedDate);
            }
        }
    }

    getTransformedValue(): any {
        const value = this.field.formControl!.value;
        if (this.to['transformOutput'] && typeof this.to['transformOutput'] === 'function') {
            return this.to['transformOutput(value)'];
        }
        return value;
    }
}
