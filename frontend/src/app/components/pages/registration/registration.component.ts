import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-registration',
  imports: [
    TranslatePipe
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {

}
