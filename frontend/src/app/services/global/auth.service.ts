import { Injectable, inject } from '@angular/core';
import { UserModel, UserLoginModel, UserRegistrationModel } from '../../models/User';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';
import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';
import { CrudService } from './crud.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private crudService = inject(CrudService);
    private router = inject(Router);

    constructor() { }

    private loggedInUserSubject = new BehaviorSubject<UserModel | null>(null);
    loggedInUser$ = this.loggedInUserSubject.asObservable();

    private remainingTimeSubject = new BehaviorSubject<number>(0);
    remainingTime$ = this.remainingTimeSubject.asObservable();

    lastLoggedInUser: string | null = null;

    logIn(_user: UserLoginModel): Observable<boolean> {
        return this.crudService.create<UserLoginModel>('login', _user).pipe(
            map((result: { token: string }) => {
                localStorage.setItem('authToken', result.token);
                this.setLoggedInUser();
                this.scheduleAutoLogout();
                return true;
            })
        );
    }

    scheduleAutoLogout(): void {
        const decodedToken = this.decodeToken();
        if (!decodedToken || !decodedToken.exp) return;

        const expiresIn = (decodedToken.exp * 1000) - Date.now();

        setInterval(() => {
            const remainingTime = this.getRemainingTime();
            this.remainingTimeSubject.next(remainingTime);
        }, 1000);

        setTimeout(() => this.logOut(), expiresIn);
    }

    getRemainingTime(): number {
        const decodedToken = this.decodeToken();
        if (!decodedToken || !decodedToken.exp) return 0;

        const expiresIn = (decodedToken.exp * 1000) - Date.now();
        return expiresIn;
    }

    getTokenId(): string | undefined {
        const decodedToken: any = this.decodeToken();
        if (decodedToken)
            this.remainingTimeSubject.next((decodedToken.exp * 1000) - Date.now());
        return decodedToken ? decodedToken.id : undefined;
    }

    decodeToken(): any {
        const token = localStorage.getItem('authToken');
        return token ? jwtDecode(token) : undefined;
    }

    setLoggedInUser(): void {
        const tokenId = this.getTokenId();
        if (!tokenId) {
            this.loggedInUserSubject.next(null);
            return;
        }
    
        this.getUserFromToken(tokenId).subscribe({
            next: (result: any) => {
                result.profile_image = createAvatar(bottts, { seed: result.username }).toDataUri();
                this.loggedInUserSubject.next(result);
                this.scheduleAutoLogout();
            },
            error: () => {
                console.error('Invalid token');
                localStorage.removeItem('authToken');
                this.loggedInUserSubject.next(null);
            }
        });
    }

    shouldGreetUser(): string | null {
        const username = this.decodeToken()?.username;
        this.lastLoggedInUser = sessionStorage.getItem('lastLoggedInUser');

        if (this.lastLoggedInUser === username) {
            return null;
        } else if (username) {
            sessionStorage.setItem('lastLoggedInUser', username);
            return username;
        }
        return null;
    }

    getUserFromToken(_id: string): Observable<Object> {
        return this.crudService.getById<Object>('users', _id);
    }

    logOut() {
        localStorage.removeItem('authToken');
        this.loggedInUserSubject.next(null);
        this.remainingTimeSubject.next(0);
        this.router.navigate(['home']);
    }

    register(_user: UserRegistrationModel): Observable<Object> {
        return this.crudService.create('users', _user);
    }
}
