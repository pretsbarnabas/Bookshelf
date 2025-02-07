import { Component } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
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

@Component({
  selector: 'app-registration',
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
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {


  constructor(
    private translationService: TranslationService,
    private formService: FormService
  ) { }

  form: FormGroup = new FormGroup({});
  // TODO : create model in /models
  model = {
    name: '',
    email: '',
    passwordGroup: ''
  };
  fields: FormlyFieldConfig[] = [];

  async ngOnInit() {
    this.translationService.currentLanguage$.subscribe(() => {      
      this.formService.getRegistrationForm().then((value) => this.fields = value);
   })
  }

  onSubmit() {
    if (this.form.valid) {      
      console.log(this.model);
    }
  }
}
