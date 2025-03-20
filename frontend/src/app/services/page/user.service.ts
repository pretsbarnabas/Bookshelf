import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from '../global/crud.service';
import { UserRoot } from '../../models/User';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private crudService = inject(CrudService);

    constructor() { }

    getAllUser(pageSize: number, pageIndex: number): Observable<UserRoot> {
        return this.crudService.getAll<UserRoot>(`users?limit=${pageSize}&page=${pageIndex}`);
    }

    // getById<T>(_endpoint: string, _id: number | string): Observable<T> {
    //     return this.http.get<T>(`${this.apiUrl}/${_endpoint}/${_id}`);
    // }

    // create<T>(_endpoint: string, _item: T): Observable<any> {
    //     return this.http.post<T>(`${this.apiUrl}/${_endpoint}`, _item);
    // }

    // update<T>(_endpoint: string, _id: number | string, _item: Partial<T>): Observable<T> {
    //     return this.http.put<T>(`${this.apiUrl}/${_endpoint}/${_id}`, _item);
    // }

    // patch<T>(_endpoint: string, _id: number | string, _item: Partial<T>): Observable<T> {
    //     return this.http.patch<T>(`${this.apiUrl}/${_endpoint}/${_id}`, _item);
    // }

    // delete(_endpoint: string, _id: number | string): Observable<void> {
    //     return this.http.delete<void>(`${this.apiUrl}/${_endpoint}/${_id}`);
    // }

}
