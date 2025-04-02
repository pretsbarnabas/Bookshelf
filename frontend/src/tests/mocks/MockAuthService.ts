import { Subject } from "rxjs";
import { UserModel } from "../../app/models/User";

export default class MockAuthService {
    loggedInUser$ = new Subject<UserModel | null>();
    remainingTime$ = new Subject<number>();

    setLoggedInUser = jasmine.createSpy('setLoggedInUser');
    logOut = jasmine.createSpy('logOut');
    logIn = jasmine.createSpy('logIn');
    register = jasmine.createSpy('register');
    getRemainingTime = jasmine.createSpy('getRemainingTime');
    decodeToken = jasmine.createSpy('decodeToken');
    shouldGreetUser = jasmine.createSpy('shouldGreetUser');
}