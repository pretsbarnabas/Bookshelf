import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { Book } from '../models/Book';
import { map,tap } from 'rxjs/operators';
import { Review } from '../models/Review';
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
    getReviewsByBook(book_id: string): Observable<Review[]> {
        return this.http.get<Review[]>(`${this.configService.get('API_URL')}/api/reviews?book_id=${book_id}`);
      }
    Addreview( newReview: any): Observable<Review> {
        return this.http.post<Review>(`${this.configService.get('API_URL')}/api/reviews`, newReview);
      }
    }
