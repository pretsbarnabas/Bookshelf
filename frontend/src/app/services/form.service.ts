import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from "@ngx-formly/core";
import { firstValueFrom } from "rxjs";
import { TranslationService } from './translation.service';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class FormService {

    constructor(private translationService: TranslationService) { }

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
                key: 'name',
                type: 'input',
                templateOptions: {
                    label: await firstValueFrom(this.translationService.service.get('AUTH.FIELDS.NAME')),
                    placeholder: await firstValueFrom(this.translationService.service.get('AUTH.PLACEHOLDERS.NAME')),
                    required: true,
                    minLength: 3
                },
                validation: {
                    messages: {
                        required: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.NAME.REQUIRED')),
                        minLength: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.NAME.MINLENGTH'))
                    }
                }
            },
            {
                key: 'email',
                type: 'input',
                templateOptions: {
                    label: await firstValueFrom(this.translationService.service.get('AUTH.FIELDS.EMAIL')),
                    placeholder: await firstValueFrom(this.translationService.service.get('AUTH.PLACEHOLDERS.EMAIL')),
                    required: true,
                },
                validation: {
                    messages: {
                        required: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.EMAIL.REQUIRED')),
                        email: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.EMAIL.INCORRECT'))
                    }
                },
                validators: {
                    email: (control: AbstractControl) => {
                        return (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(control.value);
                    }
                },
            },
            {
                key: 'passwordGroup',
                fieldGroup: [
                    {
                        key: 'password',
                        type: 'input',
                        templateOptions: {
                            type: 'password',
                            label: await firstValueFrom(this.translationService.service.get('AUTH.FIELDS.PASSWORD')),
                            required: true,
                            minLength: 4,
                        },
                        validation: {
                            messages: {
                                required: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.PASSWORD.REQUIRED')),
                                minLength: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.PASSWORD.MINLENGTH'))
                            }
                        }
                    },
                    {
                        key: 'passwordAgain',
                        type: 'input',
                        templateOptions: {
                            type: 'password',
                            label: await firstValueFrom(this.translationService.service.get('AUTH.FIELDS.PASSWORD_AGAIN')),
                            required: true,
                        },
                        validation: {
                            messages: {
                                required: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.PASSWORD_AGAIN.REQUIRED')),
                            }
                        }
                    }
                ],
                validators: {
                    fieldMatch: {
                        errorPath: 'passwordAgain',
                        expression: (control: AbstractControl) => {
                            const validator = this.passwordMatchValidator();
                            const result = validator(control);
                            return result === null;
                        },
                        message: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.PASSWORD_AGAIN.PASSWORD_MISMATCH'))
                    },
                }
            }
        ];
    }

    async getLoginForm(): Promise<FormlyFieldConfig[]> {
        return [
            {
                key: 'email',
                type: 'input',
                templateOptions: {
                    label: await firstValueFrom(this.translationService.service.get('AUTH.FIELDS.EMAIL')),
                    placeholder: await firstValueFrom(this.translationService.service.get('AUTH.PLACEHOLDERS.EMAIL')),
                    required: true,
                },
                validation: {
                    messages: {
                        required: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.EMAIL.REQUIRED')),
                        email: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.EMAIL.INCORRECT'))
                    }
                },
                validators: {
                    email: (control: AbstractControl) => {
                        return (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(control.value);
                    }
                },
            },
            {
                key: 'password',
                type: 'input',
                templateOptions: {
                    type: 'password',
                    label: await firstValueFrom(this.translationService.service.get('AUTH.FIELDS.PASSWORD')),
                    required: true                
                },
                validation: {
                    messages: {
                        required: await firstValueFrom(this.translationService.service.get('AUTH.EMSG.PASSWORD.REQUIRED'))
                    }
                }
            },           
        ];
    }
}
