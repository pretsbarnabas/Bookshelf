import { inject, Injectable } from '@angular/core';
import { FormlyFieldConfig } from "@ngx-formly/core";
import { firstValueFrom } from "rxjs";
import { TranslationService } from '../global/translation.service';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PasswordFieldWrapper } from '../../utilities/custom-field-wrappers/password-field-wrapper.component';
import { InputFieldWrapper } from '../../utilities/custom-field-wrappers/input-field-wrapper.component';
import { FileInputFieldWrapper } from '../../utilities/custom-field-wrappers/file-field-wrapper.component';
import { DateFieldWrapper } from '../../utilities/custom-field-wrappers/date-field-wrapper.component';
import { TextareaFieldWrapper } from '../../utilities/custom-field-wrappers/textarea-field-wrapper.component';
import { SelectFieldWrapper } from '../../utilities/custom-field-wrappers/select-field-wrapper.component';

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
                        function email(control: AbstractControl) {
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
    async getCreateFormConfigMapping(): Promise<{ [key: string]: FormlyFieldConfig[] }> {
        return {
            book: [
                {
                    key: 'image',
                    wrappers: [FileInputFieldWrapper],
                    templateOptions: {
                        label: await firstValueFrom(
                            this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.BOOK.IMAGE')
                        ),
                        placeholder: '',
                        required: false,
                        id: 'image'
                    }
                },
                {
                    key: 'title',
                    wrappers: [InputFieldWrapper],
                    templateOptions: {
                        label: await firstValueFrom(
                            this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.BOOK.TITLE')
                        ),
                        placeholder: '',
                        required: true,
                        id: 'title'
                    },
                    validation: {
                        messages: {
                            required: await firstValueFrom(
                                this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.ERRORS.REQUIRED')
                            )
                        }
                    }
                },
                {
                    key: 'author',
                    wrappers: [InputFieldWrapper],
                    templateOptions: {
                        label: await firstValueFrom(
                            this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.BOOK.AUTHOR')
                        ),
                        placeholder: '',
                        required: false,
                        id: 'author'
                    }
                },
                {
                    key: 'release',
                    wrappers: [DateFieldWrapper],
                    type: 'datepicker',
                    templateOptions: {
                        label: await firstValueFrom(
                            this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.BOOK.RELEASE')
                        ),
                        placeholder: '',
                        required: false,
                        id: 'release'
                    },
                    validators: {
                        isdate: (control: AbstractControl) => {
                            if (control.value === '') return true;
                            return Date.parse(control.value);
                        },
                        maxdate: (control: AbstractControl) => {
                            if (control.value === '') return true;
                            return (Date.parse(control.value)) < Date.now();
                        },
                    },
                    validation: {
                        messages: {
                            isdate: await firstValueFrom(
                                this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.ERRORS.INVALID')
                            ),
                            maxdate: await firstValueFrom(
                                this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.ERRORS.MAXDATE')
                            ),
                        },
                    }
                },
                {
                    key: 'genre',
                    type: 'select',
                    wrappers: [SelectFieldWrapper],
                    defaultValue: 'None',
                    templateOptions: {
                        label: await firstValueFrom(
                            this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.BOOK.GENRE')
                        ),
                        options: [
                            {
                                label: await firstValueFrom(
                                    this.translationService.service.get('CREATE.GENRES.NONE')
                                ), value: 'None'
                            },
                            {
                                label: await firstValueFrom(
                                    this.translationService.service.get('CREATE.GENRES.ACTION')
                                ), value: 'Action'
                            },
                            {
                                label: await firstValueFrom(
                                    this.translationService.service.get('CREATE.GENRES.ADVENTURE')
                                ), value: 'Adventure'
                            },
                            {
                                label: await firstValueFrom(
                                    this.translationService.service.get('CREATE.GENRES.CHILDREN')
                                ), value: 'Children'
                            },
                            {
                                label: await firstValueFrom(
                                    this.translationService.service.get('CREATE.GENRES.COMEDY')
                                ), value: 'Comedy'
                            },
                            {
                                label: await firstValueFrom(
                                    this.translationService.service.get('CREATE.GENRES.CRIME')
                                ), value: 'Crime'
                            },
                            {
                                label: await firstValueFrom(
                                    this.translationService.service.get('CREATE.GENRES.DETECTIVE')
                                ), value: 'Detective'
                            },
                            {
                                label: await firstValueFrom(
                                    this.translationService.service.get('CREATE.GENRES.DRAMA')
                                ), value: 'Drama'
                            },
                            {
                                label: await firstValueFrom(
                                    this.translationService.service.get('CREATE.GENRES.EROTIC')
                                ), value: 'Erotic'
                            },
                            {
                                label: await firstValueFrom(
                                    this.translationService.service.get('CREATE.GENRES.FANTASY')
                                ), value: 'Fantasy'
                            },
                            {
                                label: await firstValueFrom(
                                    this.translationService.service.get('CREATE.GENRES.HISTORICAL')
                                ), value: 'Historical'
                            },
                            {
                                label: await firstValueFrom(
                                    this.translationService.service.get('CREATE.GENRES.HORROR')
                                ), value: 'Horror'
                            },
                            {
                                label: await firstValueFrom(
                                    this.translationService.service.get('CREATE.GENRES.LITERARYPROSE')
                                ), value: 'Literary prose'
                            },
                            {
                                label: await firstValueFrom(
                                    this.translationService.service.get('CREATE.GENRES.MYSTERY')
                                ), value: 'Mystery'
                            },
                            {
                                label: await firstValueFrom(
                                    this.translationService.service.get('CREATE.GENRES.PHILOSOPHICAL')
                                ), value: 'Philosophical'
                            },
                            {
                                label: await firstValueFrom(
                                    this.translationService.service.get('CREATE.GENRES.POETRY')
                                ), value: 'Poetry'
                            },
                            {
                                label: await firstValueFrom(
                                    this.translationService.service.get('CREATE.GENRES.RELIGIOUS')
                                ), value: 'Religious'
                            },
                            {
                                label: await firstValueFrom(
                                    this.translationService.service.get('CREATE.GENRES.ROMANCE')
                                ), value: 'Romance'
                            },
                            {
                                label: await firstValueFrom(
                                    this.translationService.service.get('CREATE.GENRES.SCIFI')
                                ), value: 'SciFi'
                            },
                        ],
                        required: true,
                        id: 'genre'
                    }
                },
                {
                    key: 'description',
                    wrappers: [TextareaFieldWrapper],
                    templateOptions: {
                        label: await firstValueFrom(
                            this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.BOOK.DESC')
                        ),
                        placeholder: '',
                        required: true,
                        id: 'description'
                    },
                    validation: {
                        messages: {
                            required: await firstValueFrom(
                                this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.ERRORS.REQUIRED')
                            )
                        }
                    }
                }
            ],
            summary: [
                {
                    key: 'content',
                    wrappers: [TextareaFieldWrapper],
                    templateOptions: {
                        label: await firstValueFrom(
                            this.translationService.service.get('CREATE.CONTENT')
                        ),
                        placeholder: '',
                        required: true,
                        id: 'content'
                    },
                    validation: {
                        messages: {
                            required: await firstValueFrom(
                                this.translationService.service.get('STANDALONECOMPONENTS.EXPANSIONITEM.DIALOG.EDIT.ERRORS.REQUIRED')
                            )
                        }
                    }
                }
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
