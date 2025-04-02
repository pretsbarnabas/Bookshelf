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
import { FormService } from '../../../services/page/form.service';
import { TranslationService } from '../../../services/global/translation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isUserLoginModel, isUserRegistrationFormModel, UserModel, UserLoginModel, UserRegistrationFormModel, UserRegistrationModel } from '../../../models/User';
import { AuthService } from '../../../services/global/auth.service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/internal/operators/map';
import { shareReplay } from 'rxjs/internal/operators/shareReplay';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/page/user.service';
import { TruncatePipe } from "../../../pipes/truncate.pipe";

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
    MatIconModule,
    MatStepperModule,
    CommonModule,
    TruncatePipe
],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class AuthComponent {
    private breakpointObserver = inject(BreakpointObserver);
    private userService = inject(UserService);

    constructor(
        private translationService: TranslationService,
        private formService: FormService,
        private router: Router,
        private authService: AuthService,
        private route: ActivatedRoute
    ) { }

    private snackBar = inject(MatSnackBar);

    mode: 'login' | 'register' = 'login';

    form: FormGroup = new FormGroup({});
    model: UserLoginModel | UserRegistrationFormModel | undefined;
    fields: FormlyFieldConfig[] = [];

    errorMessages: HttpErrorResponse[] = [];
    @ViewChild('errorAlert', { static: false }) errorAlert!: ElementRef;

    isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset])
        .pipe(
            map(result => result.matches),
            shareReplay()
        );

    selectedFile?: File;
    imgBase64?: string | ArrayBuffer | null;
    selectedFileName: string = '';

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
            if (this.mode === 'login') {
                this.logIn(this.model as UserLoginModel);
            }
            else if (this.mode === 'register') {
                const user = this.model as UserRegistrationModel;
                this.register({
                    username: user.username,
                    email: user.email,
                    password: (this.model as UserRegistrationFormModel).passwordGroup.password,
                    role: 'user',
                    image: this.imgBase64 as string || ''
                })
            }
        }
    }

    async logIn(_user: UserLoginModel) {
        this.authService.logIn(_user).subscribe({
            next: async (result: boolean) => {
                if (!result) {
                    this.errorMessages = await firstValueFrom(this.translationService.service.get('AUTH.EMSG.UNEXPECTED'));
                } else {
                    this.authService.loggedInUser$.subscribe({
                        next: async (user: UserModel | null) => {
                            const lastLoggedInUser: string | null = this.authService.shouldGreetUser();
                            if (lastLoggedInUser) {
                                await this.greetUser(lastLoggedInUser);
                            }
                            this.router.navigate(['home']);
                        },
                        error: async (err) => {
                            this.errorMessages.push(new HttpErrorResponse({ error: 'UNEXPECTED' }));
                        },
                    });
                }
            },
            error: async (err: HttpErrorResponse) => {
                this.onError(err);
            }
        });
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
                this.logIn({ username: _model.username, password: _model.password });             
            },
            error: async (err: HttpErrorResponse) => {
                this.onError(err);
            }
        });
    }

    touchForm() {
        if (!this.form.valid)
            this.form.markAllAsTouched();
    }

    clearImage(){
        this.selectedFile = undefined;
        this.imgBase64 = undefined;
    }

    clearForm() {
        this.model = { username: '', email: '', passwordGroup: '' };
    }

    triggerFileInput() {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        fileInput.click();
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
            this.selectedFileName = this.selectedFile.name;

            const reader = new FileReader();
            reader.onload = () => {
                this.imgBase64 = reader.result;
            }
            reader.readAsDataURL(this.selectedFile);
        }
    }

    private onError(_error: HttpErrorResponse) {
        this.errorMessages.push(_error);
        console.log(_error)
        setTimeout(() => {
            this.errorAlert.nativeElement.scrollIntoView({ behavior: 'smooth' });
        });
    }

    getForm() {
        if (this.mode === 'login') {
            if (!isUserLoginModel(this.model))
                this.model = { username: '', password: '' }
            this.formService.getLoginForm().then((value) => this.fields = value);
        }
        else if (this.mode === 'register') {
            if (!isUserRegistrationFormModel(this.model))
                this.model = { username: '', email: '', passwordGroup: '' }
            this.formService.getRegistrationForm().then((value) => this.fields = value);
        }
    }

    switchForms(_mode: 'login' | 'register') {
        this.router.navigate([`auth/${_mode}`]);
    }
}
