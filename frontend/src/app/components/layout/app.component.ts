import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    NavbarComponent,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'frontend';

  languageKey: string = "";

  constructor(
    private translationService: TranslateService
  ) {
    translationService.addLangs(['en', 'hu']);
    translationService.setDefaultLang('en');
    translationService.use('en')
  }

  changeLanguage(key: string) {
    this.translationService.use(key);
  }
}
