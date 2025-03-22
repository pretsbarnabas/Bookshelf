import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root',
})
export class CrudService {
    private http = inject(HttpClient);
    private configService = inject(ConfigService);

    private apiUrl: string = '';

    constructor() {
        this.apiUrl = this.configService.get('API_URL');
    }

    getAll<T>(_endpoint: string): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}/${_endpoint}`);
    }

    getById<T>(_endpoint: string, _id: number | string): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}/${_endpoint}/${_id}`);
    }

    create<T>(_endpoint: string, _item: T): Observable<any> {
        return this.http.post<T>(`${this.apiUrl}/${_endpoint}`, _item);
    }

    update<T>(_endpoint: string, _id: number | string, _item: Partial<T>): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}/${_endpoint}/${_id}`, _item);
    }

    patch<T>(_endpoint: string, _id: number | string, _item: Partial<T>): Observable<T> {
        return this.http.patch<T>(`${this.apiUrl}/${_endpoint}/${_id}`, _item);
    }

    delete(_endpoint: string, _id: number | string): Observable<any> {
        return this.http.delete<void>(`${this.apiUrl}/${_endpoint}/${_id}`);
    }
}
