import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { authGuard } from './utilities/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    // menubar routes
    { path: 'home', component: HomeComponent, title: 'HOME.TITLE' },
    { path: 'books', loadComponent: () => import('./components/pages/books/books.component').then(m => m.BooksComponent), title: 'BOOKS.TITLE' },
    { path: 'summaries', loadComponent: () => import('./components/pages/summaries/summaries.component').then(m => m.SummariesComponent), title: 'SUMMARIES.TITLE' },
    { path: 'mylist', loadComponent: () => import('./components/pages/mylist/mylist.component').then(m => m.MylistComponent), canActivate: [authGuard], title: 'MYLIST.TITLE' },
    { path: 'profile', loadComponent: () => import('./components/pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard], title: 'PROFILE.TITLE' },
    { path: 'admin', loadComponent: () => import('./components/pages/admin/admin.component').then(m => m.AdminComponent), canActivate: [authGuard], title: 'ADMIN.TITLE' },
    {
        path: 'auth', canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', loadComponent: () => import('./components/pages/auth/auth.component').then(m => m.AuthComponent), title: 'AUTH.LOGINTITLE' },
            { path: 'register', loadComponent: () => import('./components/pages/auth/auth.component').then(m => m.AuthComponent), title: 'AUTH.REGISTERTITLE' },
            { path: '**', redirectTo: 'login', pathMatch: 'full' },
        ]
    },
    // non-visible routes
    { path: 'book-item', loadComponent: () => import('./components/pages/book-item/book-item.component').then(m => m.BookItemComponent), title: 'BOOKITEM.TITLE' },
    { path: 'summary-item', loadComponent: () => import('./components/pages/summary-item/summary-item.component').then(m => m.SummaryItemComponent), title: 'SUMMARYITEM.TITLE' },
    { path: 'create', canActivate: [authGuard],
        children:[
            { path: '', redirectTo: '404', pathMatch: 'full' },
            { path: 'book', loadComponent: () => import('./components/pages/create/create.component').then(m => m.CreateComponent), title: 'CREATE.TITLE' },
            { path: 'summary/:bookid', loadComponent: () => import('./components/pages/create/create.component').then(m => m.CreateComponent), title: 'CREATE.TITLE' },
            { path: '**', redirectTo: '404', pathMatch: 'full' },
        ], 
    },
    { path: '404', loadComponent: () => import('./components/pages/not-found/not-found.component').then(m => m.NotFoundComponent), title: '404.TITLE' },
    // fallback
    { path: '**', redirectTo: '/404', pathMatch: 'full' },
];
