import { inject, Injectable } from '@angular/core';
import { FormlyFieldConfig } from "@ngx-formly/core";
import { firstValueFrom } from "rxjs";
import { TranslationService } from '../global/translation.service';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PasswordFieldWrapper } from '../../components/pages/auth/custom-field-wrappers/password-field-wrapper.component';
import { InputFieldWrapper } from '../../components/pages/auth/custom-field-wrappers/input-field-wrapper.component';

@Injectable({
    providedIn: 'root'
})
export class FormService {
    private translationService = inject(TranslationService);

    constructor() { }


    private passwordMatchValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const password = control.get('password');
            const passwordAgain = control.get('passwordAgain');

            if (password && passwordAgain && password.value !== passwordAgain.value)
                return { passwordsMatch: true };
            return null;
        };
    }

    async getRegistrationForm(): Promise<FormlyFieldConfig[]> {
        return [
            {
                key: 'username',
                wrappers: [InputFieldWrapper],
                templateOptions: {
                    label: await firstValueFrom(this.translationService.service.get('AUTH.FIELDS.NAME')),
                    placeholder: await firstValueFrom(this.translationService.service.get('AUTH.PLACEHOLDERS.NAME')),
                    required: true,
                    minLength: 3,
                    maxLength: 24,
                    id: 'username',
                },
                validation: {
                    messages: {
                        required: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.NAME.REQUIRED')),
                        minLength: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.NAME.MINLENGTH')),
                        maxlength: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.NAME.MAXLENGTH')),
                    },
                },
            },
            {
                key: 'email',
                wrappers: [InputFieldWrapper],
                templateOptions: {
                    label: await firstValueFrom(this.translationService.service.get('AUTH.FIELDS.EMAIL')),
                    placeholder: await firstValueFrom(this.translationService.service.get('AUTH.PLACEHOLDERS.EMAIL')),
                    required: true,
                    id: 'email',
                },
                validation: {
                    messages: {
                        required: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.EMAIL.REQUIRED')),
                        email: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.EMAIL.INCORRECT')),
                    },
                },
                validators: {
                    email: (control: AbstractControl) => {
                        return (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(control.value);
                    },
                },
            },
            {
                key: 'passwordGroup',
                fieldGroup: [
                    {
                        key: 'password',
                        wrappers: [PasswordFieldWrapper],
                        templateOptions: {
                            type: 'password',
                            label: await firstValueFrom(this.translationService.service.get('AUTH.FIELDS.PASSWORD')),
                            required: true,
                            minLength: 4,
                            id: 'password'
                        },
                        validation: {
                            messages: {
                                required: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.PASSWORD.REQUIRED')),
                                minLength: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.PASSWORD.MINLENGTH')),
                            },
                        },
                    },
                    {
                        key: 'passwordAgain',
                        wrappers: [PasswordFieldWrapper],
                        templateOptions: {
                            type: 'password',
                            label: await firstValueFrom(this.translationService.service.get('AUTH.FIELDS.PASSWORD_AGAIN')),
                            required: true,
                            id: 'passwordAgain',
                        },
                        validation: {
                            messages: {
                                required: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.PASSWORD_AGAIN.REQUIRED')),
                                fieldMatch: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.PASSWORD_AGAIN.PASSWORD_MISMATCH')),
                            },
                        },
                        expressionProperties: {
                            'templateOptions.disabled': (model) => !model.password || model.password.length < 4,
                        },
                    },
                ],
                validators: {
                    fieldMatch: {
                        errorPath: 'passwordAgain',
                        expression: (control: AbstractControl) => {
                            const validator = this.passwordMatchValidator();
                            const result = validator(control);
                            return result === null;
                        },
                    },
                },
            },
        ];
    }

    async getLoginForm(): Promise<FormlyFieldConfig[]> {
        return [
            {
                key: 'username',
                wrappers: [InputFieldWrapper],
                templateOptions: {
                    label: await firstValueFrom(this.translationService.service.get('AUTH.FIELDS.NAME')),
                    placeholder: await firstValueFrom(this.translationService.service.get('AUTH.PLACEHOLDERS.NAME')),
                    required: true,
                    id: 'username'
                },
                validation: {
                    messages: {
                        required: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.NAME.REQUIRED')),
                    }
                }
            },
            {
                key: 'password',
                wrappers: [PasswordFieldWrapper],
                templateOptions: {
                    type: 'password',
                    label: await firstValueFrom(this.translationService.service.get('AUTH.FIELDS.PASSWORD')),
                    required: true,
                    id: 'password'
                },
                validation: {
                    messages: {
                        required: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.PASSWORD.REQUIRED'))
                    }
                }
            },
        ];
    }

    async getEditDialogFormConfigMapping(): Promise<{ [key: string]: EditDialogFieldConfig[] }> {
        return {
            user: [
                {
                    name: 'username', label: await firstValueFrom(this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.USER.USERNAME')), type: 'text', validators: [
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(24)
                    ],
                    errorMessages: {
                        required: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.NAME.REQUIRED')),
                        minLength: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.NAME.MINLENGTH')),
                        maxlength: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.NAME.MAXLENGTH')),
                    }
                },
                {
                    name: 'email', label: await firstValueFrom(this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.USER.EMAIL')), type: 'text', validators: [
                        Validators.required,
                        function email (control: AbstractControl) {
                            return (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(control.value);
                        },
                    ],
                    errorMessages: {
                        required: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.EMAIL.REQUIRED')),
                        email: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.EMAIL.INCORRECT')),
                    }
                },
                { name: 'image', label: await firstValueFrom(this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.USER.IMAGE')), type: 'text', validators: [] },
            ],
            book: [
                { name: 'title', label: await firstValueFrom(this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.BOOK.TITLE')), type: 'text', validators: [] },
                { name: 'author', label: await firstValueFrom(this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.BOOK.AUTHOR')), type: 'text', validators: [] },
                {
                    name: 'release', label: await firstValueFrom(this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.BOOK.RELEASE')), type: 'date', validators: [
                        maxDateValidator(new Date())
                    ],
                    errorMessages: {
                        maxDate: await firstValueFrom(this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.ERRORS.MAXDATE'))
                    },
                    transformInput(value: any): any {
                        if (typeof value === 'string' && value.includes('T')) {
                            const date = new Date(value);
                            return date.toISOString().split('T')[0];
                        }
                        return value;
                    },
                    transformOutput: (value: Date) => {
                        if (!value) return null;
                        return new Date(value).toISOString();
                    }
                },
                { name: 'genre', label: await firstValueFrom(this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.BOOK.GENRE')), type: 'text', validators: [] },
                { name: 'description', label: await firstValueFrom(this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.BOOK.DESC')), type: 'textarea', validators: [] },
                { name: 'image', label: await firstValueFrom(this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.BOOK.IMAGE')), type: 'text', validators: [] },
            ],
            review: [
                {
                    name: 'score', label: await firstValueFrom(this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.REVIEW.SCORE')), type: 'number', validators: [
                        Validators.min(0),
                        Validators.max(10)
                    ],
                    errorMessages: {
                        min: await firstValueFrom(this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.ERRORS.SCOREMIN')),
                        max: await firstValueFrom(this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.ERRORS.SCOREMAX'))
                    }
                },
                { name: 'content', label: await firstValueFrom(this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.CONTENT')), type: 'textarea', validators: [] },
            ],
            summary: [
                {
                    name: 'content', label: await firstValueFrom(this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.CONTENT')), type: 'textarea', validators: [
                        Validators.required
                    ],
                    errorMessages: {
                        required: await firstValueFrom(this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.ERRORS.REQUIRED'))
                    }
                },
            ],
            comment: [
                {
                    name: 'content', label: await firstValueFrom(this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.CONTENT')), type: 'textarea', validators: [
                        Validators.required
                    ],
                    errorMessages: {
                        required: await firstValueFrom(this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.ERRORS.REQUIRED'))
                    }
                },
            ]
        };
    }
}

export function maxDateValidator(maxDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;

        const selectedDate = new Date(control.value);
        if (selectedDate > maxDate) {
            return { maxDate: { value: control.value, max: maxDate.toISOString().split('T')[0] } };
        }
        return null;
    };
}

export interface EditDialogFieldConfig {
    name: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'textarea';
    options?: any[];
    validators?: any[];
    errorMessages?: { [key: string]: string };
    transformInput?: any;
    transformOutput?: any;
}
