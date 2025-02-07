import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FooterComponent } from './footer/footer.component';

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
    TranslatePipe,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'frontend';

  sidenavButtons: {route: string, icon:string, label: string}[] = [
    {route: "home", icon:"home", label:"HOME"},
    {route: "books", icon:"library_books", label:"BOOKS"},
    {route: "summaries", icon:"notes", label:"SUMMARIES"},
    {route: "mylist", icon:"list_alt", label:"MYLIST"},
    {route: "login", icon:"login", label:"LOGIN"},
    {route: "registration", icon:"person_add", label:"REGISTER"},
  ]
}
