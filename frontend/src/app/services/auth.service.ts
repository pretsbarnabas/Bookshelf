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

    private loggedInUser: UserLoggedInModel | null = null;
    lastLoggedInUser: string | null = null;

    get getloggedInUser() : UserLoggedInModel | null{
        return this.loggedInUser;
    }

    logIn(_user: UserLoginModel): Observable<boolean> { 
        return this.http.post<{ token: string }>(`${this.configService.get('API_URL')}/api/login`, _user).pipe(

            map((result: { token: string }) => {
                const token = result.token;
                localStorage.setItem('authToken', token);
                return true;
            })
        );
    }

    getTokenId(): string | undefined {
        const decodedToken: any = this.decodeToken();
        if(decodedToken)
            return decodedToken.id;
        return undefined;   
    }

    decodeToken(): any {
        const token = localStorage.getItem('authToken');
        if (!token) return undefined;

        return jwtDecode(token);
    }

    setLoggedInUser(): boolean {
        const tokenId = this.getTokenId();        
        if (!tokenId) return false;

        try {
            this.getUserFromToken(tokenId).subscribe({
                next: ((result: any) => {

                    delete result._id;
                    delete result.password_hashed;
                    this.loggedInUser = result;
                    console.log(this.loggedInUser);
                    return true;
                })
            });   
            return true;
        } catch (error) {
            console.error('Invalid token', error);
            localStorage.removeItem('authToken');
            this.loggedInUser = null;
            return false;
        }
    }

    shouldGreetUser(): string | null{
        const username = this.decodeToken().username;
        this.lastLoggedInUser = sessionStorage.getItem('lastLoggedInUser');
        if(this.lastLoggedInUser === username){
            return null;
        }
        else if(username){
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
        if (this.loggedInUser) {
            this.loggedInUser = null;
        }
        this.router.navigate(['home']);
    }

    register(_user: UserRegistrationModel): Observable<Object> {
        return this.http.post(`${this.configService.get('API_URL')}/api/users`, _user);
    }
}
