import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { authGuard } from './utilities/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    // menubar routes
    { path: 'home', component: HomeComponent, data: { preload: true } },
    { path: 'books', loadComponent: () => import('./components/pages/books/books.component').then(m => m.BooksComponent), data: { preload: true } },
    { path: 'summaries', loadComponent: () => import('./components/pages/summaries/summaries.component').then(m => m.SummariesComponent), data: { preload: true } },
    { path: 'mylist', loadComponent: () => import('./components/pages/mylist/mylist.component').then(m => m.MylistComponent), canActivate: [authGuard], data: { preload: true } },
    {
        path: 'auth', canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', loadComponent: () => import('./components/pages/auth/auth.component').then(m => m.AuthComponent), data: { preload: true } },
            { path: 'register', loadComponent: () => import('./components/pages/auth/auth.component').then(m => m.AuthComponent), data: { preload: true } },
            { path: '**', redirectTo: 'login', pathMatch: 'full' },
        ]
    },
    // non-visible routes
    { path: 'profile', loadComponent: () => import('./components/pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard], data: { preload: true } },
    { path: 'book-item', loadComponent: () => import('./components/pages/book-item/book-item.component').then(m => m.BookItemComponent), data: { preload: true } },
    { path: 'summary-item', loadComponent: () => import('./components/pages/summary-item/summary-item.component').then(m => m.SummaryItemComponent), data: { preload: true } },
    { path: '404', loadComponent: () => import('./components/pages/not-found/not-found.component').then(m => m.NotFoundComponent), data: { preload: true } },
    // fallback
    { path: '**', redirectTo: '/404', pathMatch: 'full' },
];
