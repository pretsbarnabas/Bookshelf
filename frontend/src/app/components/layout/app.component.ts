import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    NavbarComponent,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'frontend';

  buttons: {route: string, icon: string, title: string}[] = [
    {route: 'home', icon: 'home', title: 'Home'},
    {route: 'books', icon: 'library_books', title: 'Books'},
    {route: 'summaries', icon: 'notes', title: 'Summaries'},
    {route: 'mylist', icon: 'list_alt', title: 'Mylist'},
    {route: 'login', icon: 'login', title: 'Login'},
    {route: 'registration', icon: 'person_add', title: 'Registration'},
  ]
}
