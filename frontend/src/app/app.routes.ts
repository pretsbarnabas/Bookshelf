import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BooksComponent } from './components/books/books.component';
import { SummariesComponent } from './components/summaries/summaries.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { MylistComponent } from './components/mylist/mylist.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BookItemComponent } from './components/book-item/book-item.component';
import { SummaryItemComponent } from './components/summary-item/summary-item.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
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
