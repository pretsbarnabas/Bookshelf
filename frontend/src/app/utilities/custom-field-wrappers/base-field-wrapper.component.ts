import { Component, HostListener } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FieldWrapper } from "@ngx-formly/core";

@Component({
    selector: 'base-field-wrapper',
    standalone: true,
    imports: [],
    template: ''
})
export class BaseFieldWrapper extends FieldWrapper {
    triggerFillAppearance: boolean = false;

    get formControlAsFormControl(): FormControl {
        return this.formControl as FormControl;
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
