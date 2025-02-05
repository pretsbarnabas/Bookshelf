import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { BooksComponent } from './components/pages/books/books.component';
import { SummariesComponent } from './components/pages/summaries/summaries.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegistrationComponent } from './components/pages/registration/registration.component';
import { MylistComponent } from './components/pages/mylist/mylist.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { BookItemComponent } from './components/pages/book-item/book-item.component';
import { SummaryItemComponent } from './components/pages/summary-item/summary-item.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full'},
    { path: 'home', component: HomeComponent},
    // menubar routes
    { path: 'books', component: BooksComponent},
    { path: 'summaries', component: SummariesComponent},
    { path: 'mylist', component: MylistComponent},
    { path: 'login', component: LoginComponent},
    { path: 'registration', component: RegistrationComponent},
    { path: 'profile', component: ProfileComponent},
    // non-visible routes
    { path: 'book-item', component: BookItemComponent},
    { path: 'summary-item', component: SummaryItemComponent},

];
