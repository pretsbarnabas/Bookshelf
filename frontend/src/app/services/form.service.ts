import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from "@ngx-formly/core";
import { firstValueFrom } from "rxjs";
import { TranslationService } from './translation.service';

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
      },
      {
        key: 'email',
        type: 'input',
        templateOptions: {
          label: await firstValueFrom(this.translationService.service.get('REGISTRATION.FIELDS.EMAIL')),
          placeholder: await firstValueFrom(this.translationService.service.get('REGISTRATION.PLACEHOLDERS.EMAIL')),
          required: true,
        },
      },
      {
        key: 'password',
        type: 'input',
        templateOptions: {
          label: await firstValueFrom(this.translationService.service.get('REGISTRATION.FIELDS.PASSWORD')),
          placeholder: '',
          required: true,
        },
      },
      {
        key: 'passwordAgain',
        type: 'input',
        templateOptions: {
          label: await firstValueFrom(this.translationService.service.get('REGISTRATION.FIELDS.PASSWORD_AGAIN')),
          placeholder: '',
          required: true,
        },
      }
    ];
  }
}
