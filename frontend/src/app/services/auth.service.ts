import { Injectable } from '@angular/core';
import { UserLoggedInModel, UserLoginModel, UserRegistrationModel } from '../models/User';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) { }

    loggedInUser: UserLoggedInModel | undefined;

    logIn(_user: UserLoginModel) {
        // Temporary
        // this.loggedInUser = {username: 'testname', email: 'test@testing.com', role: 'user'};
        localStorage.setItem('user', JSON.stringify(this.loggedInUser));
    }

    logOut() {

    }

    checkLogin() {

    }

    register(_user: UserRegistrationModel): /*Observable<Object>*/void {
        // return this.http.post(`${this.configService.get('API_URL')}/api/users`, _user);
        console.log(this.configService.get('API_URL'));
        
    }
}
