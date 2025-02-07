import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from "@ngx-formly/core";
import { firstValueFrom } from "rxjs";
import { TranslationService } from './translation.service';
import { AbstractControl } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class FormService {

    constructor(private translationService: TranslationService) { }

    async getRegistrationForm(): Promise<FormlyFieldConfig[]> {
        return [
            {
                key: 'name',
                type: 'input',
                templateOptions: {
                    label: await firstValueFrom(this.translationService.service.get('REGISTRATION.FIELDS.NAME')),
                    placeholder: await firstValueFrom(this.translationService.service.get('REGISTRATION.PLACEHOLDERS.NAME')),
                    required: true,
                },
                validation: {
                    messages: {
                        required: await firstValueFrom(this.translationService.service.get('REGISTRATION.EMSG.NAME.REQUIRED'))
                    }
                }
            },
            {
                key: 'email',
                type: 'input',
                templateOptions: {
                    label: await firstValueFrom(this.translationService.service.get('REGISTRATION.FIELDS.EMAIL')),
                    placeholder: await firstValueFrom(this.translationService.service.get('REGISTRATION.PLACEHOLDERS.EMAIL')),
                    required: true,
                },
                validation: {
                    messages: {
                        required: await firstValueFrom(this.translationService.service.get('REGISTRATION.EMSG.EMAIL.REQUIRED'))
                    }
                }
            },
            {
                key: 'password',
                type: 'input',
                templateOptions: {
                    label: await firstValueFrom(this.translationService.service.get('REGISTRATION.FIELDS.PASSWORD')),
                    required: true,
                },
                validation: {
                    messages: {
                        required: await firstValueFrom(this.translationService.service.get('REGISTRATION.EMSG.PASSWORD.REQUIRED'))
                    }
                }
            },
            {
                key: 'passwordAgain',
                type: 'input',
                templateOptions: {
                    label: await firstValueFrom(this.translationService.service.get('REGISTRATION.FIELDS.PASSWORD_AGAIN')),
                    required: true,
                },
                validation: {
                    messages: {
                        required: await firstValueFrom(this.translationService.service.get('REGISTRATION.EMSG.PASSWORD_AGAIN.REQUIRED'))
                    }
                }
            }
        ];
    }
}
