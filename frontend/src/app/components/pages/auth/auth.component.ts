import { Component, inject } from '@angular/core';
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
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

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

    private snackBar = inject(MatSnackBar);

    mode: 'login' | 'register' = 'login';

    form: FormGroup = new FormGroup({});
    model: UserLoginModel | UserRegistrationFormModel | undefined;
    fields: FormlyFieldConfig[] = [];

    errorMessage: string = '';

    async ngOnInit() {
        this.route.url.subscribe((segments) => {
            const childRoute = segments[0]?.path;
            if (childRoute === 'register')
                this.mode = 'register';
            else
                this.mode = 'login';
            this.getForm();
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

    async logIn(_user: UserLoginModel) {
        this.authService.logIn(_user).subscribe({
            next: async (result: boolean) => {
                if (!result)
                    this.errorMessage = await firstValueFrom(this.translationService.service.get('AUTH.EMSG.UNEXPECTED'))
                else {
                    console.log(this.authService.setLoggedInUser());
                    
                    if (this.authService.setLoggedInUser()) {
                        const lastLoggedInUser: string | null = this.authService.shouldGreetUser()
                        console.log(lastLoggedInUser);
                        if(lastLoggedInUser)
                            await this.greetUser(lastLoggedInUser);
                        this.router.navigate(['home']);
                        this.spinner.hide();
                    } else {
                        this.spinner.hide();
                        this.errorMessage = await firstValueFrom(this.translationService.service.get('AUTH.EMSG.UNEXPECTED'))
                    }
                }
            },
            error: (err: Error) => {
                this.errorMessage = err.message;
                this.spinner.hide();
            }
        })
    }

    async greetUser(username: string){
        this.snackBar.open(
            `${await firstValueFrom(this.translationService.service.get('AUTH.SNACKBAR.WELCOME'))} ${username}!`,
            await firstValueFrom(this.translationService.service.get('AUTH.SNACKBAR.CLOSE')),
            {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 5000
            }
        )
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
        // this.form = new FormGroup({})
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
        this.router.navigate([`auth/${_mode}`]);
    }
}
