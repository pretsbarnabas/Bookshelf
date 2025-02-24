import { Component, ElementRef, inject, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { MatIconModule } from '@angular/material/icon';
import { FormService } from '../../../services/form.service';
import { TranslationService } from '../../../services/translation.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { isUserLoginModel, isUserRegistrationFormModel, UserLoginModel, UserRegistrationFormModel, UserRegistrationModel } from '../../../models/User';
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
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss',
    encapsulation: ViewEncapsulation.None
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

    errorMessages: Error[] = [];
    @ViewChild('errorAlert', { static: false }) errorAlert!: ElementRef;

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
        this.errorMessages = [];
        if (this.form.valid) {
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
    }

    async logIn(_user: UserLoginModel) {
        this.authService.logIn(_user).subscribe({
            next: async (result: boolean) => {
                if (!result)
                    this.errorMessages = await firstValueFrom(this.translationService.service.get('AUTH.EMSG.UNEXPECTED'))
                else {
                    console.log(this.authService.setLoggedInUser());

                    if (this.authService.setLoggedInUser()) {
                        const lastLoggedInUser: string | null = this.authService.shouldGreetUser()
                        console.log(lastLoggedInUser);
                        if (lastLoggedInUser)
                            await this.greetUser(lastLoggedInUser);
                        this.router.navigate(['home']);
                        this.spinner.hide();
                    } else {
                        this.spinner.hide();
                        this.errorMessages.push(new Error('UNEXPECTED'))
                    }
                }
            },
            error: async (err: Error) => {
                this.onError(err);
            }
        })
    }

    async greetUser(username: string) {
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

    async register(_model: UserRegistrationModel) {
        this.authService.register(_model).subscribe({
            next: async (model: any) => {
                console.log('Registration succesful');
                this.logIn({ username: _model.username, password: _model.password });
            },
            error: async (err: Error) => {
                this.onError(err);
            }
        });
    }

    private onError(_error: Error) {
        this.spinner.hide();
        this.errorMessages.push(_error);
        setTimeout(() => {
            this.errorAlert.nativeElement.scrollIntoView({ behavior: 'smooth' });
        });
    }

    getForm() {
        if (this.mode === 'login') {
            if(!isUserLoginModel(this.model))
                this.model = { username: '', password: '' }
            this.formService.getLoginForm().then((value) => this.fields = value);
        }
        else if (this.mode === 'register') {
            if(!isUserRegistrationFormModel(this.model))
                this.model = { username: '', email: '', passwordGroup: '' }
            this.formService.getRegistrationForm().then((value) => this.fields = value);
        }
    }

    switchForms(_mode: 'login' | 'register') {
        this.router.navigate([`auth/${_mode}`]);
    }
}
