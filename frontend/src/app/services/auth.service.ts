import { Injectable } from '@angular/core';
import { UserLoggedInModel, UserLoginModel, UserRegistrationModel } from '../models/User';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private http: HttpClient,
        private configService: ConfigService,
        private router: Router
    ) { }

    loggedInUser: UserLoggedInModel | null = null;

    logIn(_user: UserLoginModel): Observable<boolean> {
        return this.http.post<{ token: string }>(`${this.configService.get('API_URL')}/api/login`, _user).pipe(
            map((result: { token: string }) => {
                const token = result.token;
                localStorage.setItem('authToken', token);
                localStorage.setItem('isLoggedIn', '1');
                return true;
            })
        );
    }

    getTokenId(): string | undefined {
        const token = localStorage.getItem('authToken');
        if (!token) return undefined;

        const decodedToken: any = jwtDecode(token);
        return decodedToken.id;
    }

    setLoggedInUser(): boolean {
        const tokenId = this.getTokenId();
        if (!tokenId) return false;

        try {
            this.getLoggedInUser(tokenId).subscribe({
                next:((result: any) => {  
                                  
                    delete result._id;
                    delete result.password_hashed;
                    this.loggedInUser = result;
                    console.log(this.loggedInUser);
                    return true;
                })
            });
            return false;
        } catch (error) {
            console.error('Invalid token', error);
            return false;
        }
    }

    getLoggedInUser(_id: string): Observable<Object> {
        return this.http.get<Object>(`${this.configService.get('API_URL')}/api/users/${_id}`);
    }

    logOut() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isLoggedIn');
        if (this.loggedInUser) {
            this.loggedInUser = null;
        }
        console.log(this.loggedInUser);
        
        this.router.navigate(['home']);
    }

    checkLogin() {
        const tokenId = this.getTokenId();
        if (!tokenId) return;

        this.getLoggedInUser(tokenId).subscribe({
            next:((result: any) => {  
                              
                delete result._id;
                delete result.password_hashed;
                this.loggedInUser = result;
                console.log(this.loggedInUser);
                return true;
            })
        })
    }

    register(_user: UserRegistrationModel): Observable<Object> {
        return this.http.post(`${this.configService.get('API_URL')}/api/users`, _user);
    }
}
