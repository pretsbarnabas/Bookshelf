import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../global/config.service';
import { BookModel, BookRoot, CreateBookModel } from '../../models/Book';
import { CrudService } from '../global/crud.service';
import { ReviewModel } from '../../models/Review';
@Injectable({
    providedIn: 'root'
})
export class BookService {
    private configService = inject(ConfigService);

    private crudService = inject(CrudService);

    constructor() { }

    getAllBooks(pageSize: number, pageIndex: number, userId?: number | string, sort?: string, sortType?: 'asc' | 'desc'): Observable<BookRoot> {
        return this.crudService.getAll<BookRoot>(`books?limit=${pageSize}&page=${pageIndex}${userId ? `&user_id=${userId}` : ''}${sort ? `&sort=${sort}` : ''}${sortType ? `&sortType=${sortType}` : ''}`);
    }
    getBookById(id: string): Observable<any> {
        return this.crudService.getById<BookModel>('books', id);
    }
    getReviewsByBook(book_id: string, pageIndex: number, pageSize: number): Observable<any> {
        return this.crudService.getAll<any>(`reviews?book_id=${book_id}&limit=${pageSize}&page=${pageIndex}`);
    }
    Addreview(newReview: any): Observable<ReviewModel> {
        return this.crudService.create<ReviewModel>('reviews', newReview);
    }

    deleteBook(_id: number | string): Observable<any> {
        return this.crudService.delete('books', _id)
    }

    updateBook(_id: number | string, data: BookModel): Observable<any> {
        return this.crudService.update('books', _id, data);
    }

    createBook(data: CreateBookModel): Observable<BookModel> {
        return this.crudService.create<CreateBookModel>('books', data);
    }
}