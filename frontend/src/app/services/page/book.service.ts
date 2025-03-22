import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../global/config.service';
import { Book, BookRoot } from '../../models/Book';
import { CrudService } from '../global/crud.service';
import { ReviewModel } from '../../models/Review';
@Injectable({
    providedIn: 'root'
})
export class BookService {
    // deprecated
    private http = inject(HttpClient);
    private configService = inject(ConfigService);

    private crudService = inject(CrudService);

    constructor() { }

    getAllBooks(pageSize: number, pageIndex: number): Observable<BookRoot> {
        return this.crudService.getAll<BookRoot>(`books?limit=${pageSize}&page=${pageIndex}`);
    }
    getBookById(id: string): Observable<any> {
        return this.http.get<Book>(`${this.configService.get('API_URL')}/books/${id}`);
    }
    getReviewsByBook(book_id: string, pageSize: number): Observable<any> {
        return this.http.get<any>(`${this.configService.get('API_URL')}/reviews?book_id=${book_id}&limit=${pageSize}`);
    }
    Addreview(newReview: any): Observable<ReviewModel> {
        return this.http.post<ReviewModel>(`${this.configService.get('API_URL')}/reviews`, newReview);
    }

    deleteBook(_id: number | string) {
        return this.crudService.delete('books', _id)
    }
}