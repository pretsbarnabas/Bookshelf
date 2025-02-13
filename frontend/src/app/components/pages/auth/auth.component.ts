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
import { ActivatedRoute, Router } from '@angular/router';
import { UserLoginModel, UserRegistrationFormModel, UserRegistrationModel } from '../../../models/User';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-auth',
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
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss'
})
export class AuthComponent {

    constructor(
        private translationService: TranslationService,
        private formService: FormService,
        private spinner: NgxSpinnerService,
        private router: Router,
        private authService: AuthService,
        private route: ActivatedRoute
    ) { }

    mode: 'login' | 'register' = 'login';

    form: FormGroup = new FormGroup({});
    model: UserLoginModel | UserRegistrationFormModel | undefined;
    fields: FormlyFieldConfig[] = [];

    async ngOnInit() {
        this.route.queryParamMap.subscribe((params) => {
            if(!['register', 'login'].includes(params.get('mode')!)){
                this.router.navigate([], {
                    queryParams: { mode: 'login' },
                    queryParamsHandling: 'merge',
                });
            } else {
                this.mode = params.get('mode')! === 'login' ? 'login' : 'register';
                // console.log(this.mode);
                this.getForm();
            }
        });
        this.translationService.currentLanguage$.subscribe(() => {
            this.getForm();
        })
    }

    onSubmit() {
        if (this.form.valid) {
            console.log(this.model);
            this.spinner.show();
            // Temporary
            setTimeout(() => {
                this.spinner.hide();
                if (this.mode === 'login')
                    this.authService.logIn(this.model as UserLoginModel);
                else if (this.mode === 'register') {
                    this.model = this.model as UserRegistrationFormModel;
                    this.authService.register({
                        username: this.model.name,
                        email: this.model.email,
                        password: this.model.passwordGroup.password,
                        role: 'user'
                    });                                        
                }
                this.router.navigate(['home']);         
            }, 3000);   
        }
    }

    getForm() {
        this.form = new FormGroup({})
        if (this.mode === 'login') {
            this.formService.getLoginForm().then((value) => this.fields = value);
            this.model = { email: '', password: '' }
        }
        else if (this.mode === 'register') {
            this.model = { name: '', email: '', passwordGroup: '' }
            this.formService.getRegistrationForm().then((value) => this.fields = value);
        }
    }

    switchForms(_mode: 'login' | 'register') {
        this.mode = _mode;
        this.router.navigate([], {
            queryParams: { mode: this.mode },
            queryParamsHandling: 'merge',
        });
    }
}
