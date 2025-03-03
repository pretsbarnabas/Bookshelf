import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { authGuard } from './utilities/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    // menubar routes
    { path: 'home', component: HomeComponent },
    { path: 'books', loadComponent: () => import('./components/pages/books/books.component').then(m => m.BooksComponent) },
    { path: 'summaries', loadComponent: () => import('./components/pages/summaries/summaries.component').then(m => m.SummariesComponent) },
    { path: 'mylist', loadComponent: () => import('./components/pages/mylist/mylist.component').then(m => m.MylistComponent), canActivate: [authGuard] },
    {
        path: 'auth', canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', loadComponent: () => import('./components/pages/auth/auth.component').then(m => m.AuthComponent) },
            { path: 'register', loadComponent: () => import('./components/pages/auth/auth.component').then(m => m.AuthComponent) },
            { path: '**', redirectTo: 'login', pathMatch: 'full' },
        ]
    },
    // non-visible routes
    { path: 'profile', loadComponent: () => import('./components/pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
    { path: 'book-item', loadComponent: () => import('./components/pages/book-item/book-item.component').then(m => m.BookItemComponent) },
    { path: 'summary-item', loadComponent: () => import('./components/pages/summary-item/summary-item.component').then(m => m.SummaryItemComponent) },
    { path: '404', loadComponent: () => import('./components/pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
    // fallback
    { path: '**', redirectTo: '/404', pathMatch: 'full' },
];
