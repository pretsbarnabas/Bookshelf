import { Injectable } from '@angular/core';
import { UserLoggedInModel, UserLoginModel, UserRegistrationModel } from '../models/User';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';
import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private http: HttpClient,
        private configService: ConfigService,
        private router: Router
    ) { }

    private loggedInUserSubject = new BehaviorSubject<UserLoggedInModel | null>(null);    
    loggedInUser$ = this.loggedInUserSubject.asObservable();

    lastLoggedInUser: string | null = null;    

    logIn(_user: UserLoginModel): Observable<boolean> { 
        return this.http.post<{ token: string }>(`${this.configService.get('API_URL')}/api/login`, _user).pipe(
            map((result: { token: string }) => {
                localStorage.setItem('authToken', result.token);
                this.setLoggedInUser();
                return true;
            })
        );
    }

    getTokenId(): string | undefined {
        const decodedToken: any = this.decodeToken();
        return decodedToken ? decodedToken.id : undefined;
    }

    decodeToken(): any {
        const token = localStorage.getItem('authToken');
        return token ? jwtDecode(token) : undefined;
    }

    // setLoggedInUser(): void {
    //     const tokenId = this.getTokenId();
    //     if (!tokenId) {
    //         this.loggedInUserSubject.next(null);
    //         return;
    //     }
    

    //     this.getUserFromToken(tokenId).subscribe({
    //         next: (result: any) => {
    //             delete result._id;
    //             delete result.password_hashed;
    //             result.profile_image = createAvatar(bottts, { seed: result.username }).toDataUri();
    //             this.loggedInUserSubject.next(result);
    //         },
    //         error: () => {
    //             console.error('Invalid token');
    //             localStorage.removeItem('authToken');
    //             this.loggedInUserSubject.next(null);
    //         }
    //     });
    // }
    setLoggedInUser(): void {
        const tokenId = this.getTokenId();
        if (!tokenId) {
            this.loggedInUserSubject.next(null);
            return;
        }
    
        this.getUserFromToken(tokenId).subscribe({
            next: (result: any) => {
                result.profile_image = createAvatar(bottts, { seed: result.username }).toDataUri();
                this.loggedInUserSubject.next(result as UserLoggedInModel);
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
        return this.http.get<Object>(`${this.configService.get('API_URL')}/api/users/${_id}`);
    }

    logOut() {
        localStorage.removeItem('authToken');
        this.loggedInUserSubject.next(null);
        this.router.navigate(['home']);
    }

    register(_user: UserRegistrationModel): Observable<Object> {
        return this.http.post(`${this.configService.get('API_URL')}/api/users`, _user);
    }
}
