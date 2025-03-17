import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../global/config.service';
import { Book } from '../../models/Book';
import { map,tap } from 'rxjs/operators';
import { CrudService } from '../global/crud.service';
@Injectable({
    providedIn: 'root'
})
export class BookService {
    private crudService = inject(CrudService);
    

    constructor() { }

    getAllBooks(pageSize: number): Observable<Book[]> {
        return this.crudService.getAll<Book>(`books?limit=${pageSize}`);
    }
    getBookById(id: string): Observable<any> {
        return this.crudService.getById<Book>('books', id);
      }
    getAllReviewsByBookId(id: string): Observable<any> {
        return this.crudService.getById<any>('reviews', id);
    }
}