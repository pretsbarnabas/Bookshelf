import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { Book } from '../models/Book';
import { map,tap } from 'rxjs/operators';
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
    getBookById(id: string): Observable<any> {
        return this.http.get<Book>(`${this.configService.get('API_URL')}/api/books/${id}`);
      }
    getAllReviewsByBookId(id: string): Observable<any> {
        return this.http.get<any>(`${this.configService.get('API_URL')}/api/reviews/${id}`);
    }
}