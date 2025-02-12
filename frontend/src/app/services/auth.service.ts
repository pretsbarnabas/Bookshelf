import { Injectable } from '@angular/core';
import { UserLoggedInModel, UserLoginModel, UserRegistrationModel } from '../models/User';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor() { }

    loggedInUser: UserLoggedInModel | undefined;

    logIn(_user: UserLoginModel) {
        // Temporary
        this.loggedInUser = {username: 'testname', email: 'test@testing.com', role: 'user'};
        localStorage.setItem('user', JSON.stringify(this.loggedInUser));
    }

    logOut() {

    }

    checkLogin() {

    }

    register(_user: UserRegistrationModel) {

    }
}
