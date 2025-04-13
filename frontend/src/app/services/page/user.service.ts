import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from '../global/crud.service';
import { UserModel, UserRoot } from '../../models/User';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private crudService = inject(CrudService);

    constructor() { }

    getAllUser(pageSize: number, pageIndex: number): Observable<UserRoot> {
        return this.crudService.getAll<UserRoot>(`users?limit=${pageSize}&page=${pageIndex}`);
    }

    getUserById(_id: number | string): Observable<UserModel> {
        return this.crudService.getById('users', _id);
    }

    deleteUser(_id: number | string): Observable<any> {
        return this.crudService.delete('users', _id);
    }

    updateUser(_id: number | string, data: UserModel): Observable<any> {
        return this.crudService.update('users', _id, data);
    }
}
