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
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

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

    errorMessage: string = '';

    async ngOnInit() {
        this.route.queryParamMap.subscribe((params) => {
            if (!['register', 'login'].includes(params.get('mode')!)) {
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
            this.errorMessage = '';
            console.log(this.model);
            this.spinner.show();
            if (this.mode === 'login') {
                this.logIn(this.model as UserLoginModel);
            }
            else if (this.mode === 'register') {
                const user = this.model as UserRegistrationFormModel;
                this.register({
                    username: user.username,
                    email: user.email,
                    password: user.passwordGroup.password,
                    role: 'user'
                })
            }
        }
        console.log(this.errorMessage);
    }

    logIn(_user: UserLoginModel) {
        this.authService.logIn(_user).subscribe({
            next: async (result: boolean) => {
                if (!result)
                    this.errorMessage = await firstValueFrom(this.translationService.service.get('AUTH.EMSG.UNEXPECTED'))
                else {
                    if (this.authService.setLoggedInUser()) {
                        this.spinner.hide();
                    } else {
                        this.spinner.hide();
                        this.router.navigate(['home']);
                        this.errorMessage = await firstValueFrom(this.translationService.service.get('AUTH.EMSG.UNEXPECTED'))
                    }
                }
            },
            error: (err: Error) => {
                this.errorMessage = err.message;
            }
        })
    }

    register(_model: UserRegistrationModel) {
        this.authService.register(_model).subscribe({
            next: (model: any) => {
                console.log('Registration succesful');
                this.logIn({ username: _model.username, password: _model.password });
            },
            error: (err: Error) => {
                this.errorMessage = err.message;
                this.spinner.hide();
            }
        });
    }

    getForm() {
        this.form = new FormGroup({})
        if (this.mode === 'login') {
            this.formService.getLoginForm().then((value) => this.fields = value);
            this.model = { username: '', password: '' }
        }
        else if (this.mode === 'register') {
            this.model = { username: '', email: '', passwordGroup: '' }
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
