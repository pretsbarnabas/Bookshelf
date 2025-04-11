import { of } from "rxjs";
import { UserModel } from "../../app/models/User";

export default class MockUserService {
    getAllUser = jasmine.createSpy('getAllUser');
    deleteUser = jasmine.createSpy('deleteUser');
    updateUser = jasmine.createSpy('updateUser');
    getUserById = jasmine.createSpy('getUserById').and.returnValue(of({ username: 'test', role: 'user' } as UserModel));
}