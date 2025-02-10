import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { FormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FormService } from '../../../services/form.service';
import { TranslationService } from '../../../services/translation.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'app-login',
    imports: [
        TranslatePipe,
        FormlyModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        FormlyMaterialModule,
        ReactiveFormsModule,
        MatButtonModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

    constructor(
        private translationService: TranslationService,
        private formService: FormService,
        private spinner: NgxSpinnerService
    ) { }

    form: FormGroup = new FormGroup({});
    model = {
        email: '',
        password: ''
    };
    fields: FormlyFieldConfig[] = [];

    async ngOnInit() {
        this.translationService.currentLanguage$.subscribe(() => {
            this.formService.getLoginForm().then((value) => this.fields = value);
        })
    }

    onSubmit() {
        if (this.form.valid) {
            console.log(this.model);
            this.spinner.show();
            // Temporary
            setTimeout(() => {
                this.spinner.hide();
            }, 3000);
        }
    }

}
