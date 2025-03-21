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

    deleteUser(_id: number | string) {
        return this.crudService.delete('users', _id)
    }
}
