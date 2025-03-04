import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { Book } from '../models/Book';

@Injectable({
    providedIn: 'root'
})
export class BookService {

    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) { }

    getAllBooks(pageSize: number): Observable<Book[]> {
        return this.http.get<Book[]>(`${this.configService.get('API_URL')}/api/books?limit=${pageSize}`);
    }
}