import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../global/config.service';
import { Book, BookRoot } from '../../models/Book';
import { map,tap } from 'rxjs/operators';
import { CrudService } from '../global/crud.service';
@Injectable({
    providedIn: 'root'
})
export class BookService {
    private crudService = inject(CrudService);   

    constructor() { }

    getAllBooks(pageSize: number, pageIndex: number): Observable<BookRoot> {
        return this.crudService.getAll<BookRoot>(`books?limit=${pageSize}&page=${pageIndex}`);
    }
    getBookById(id: string): Observable<any> {
        return this.crudService.getById<Book>('books', id);
      }
    getAllReviewsByBookId(id: string): Observable<any> {
        return this.crudService.getById<any>('reviews', id);
    }
}