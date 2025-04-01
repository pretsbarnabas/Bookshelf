import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../global/config.service';
import { Book, BookRoot } from '../../models/Book';
import { CrudService } from '../global/crud.service';
import { Review } from '../../models/Review';
import { BookList } from '../../models/Booklist';
@Injectable({
  providedIn: 'root'
})
export class BooklistService {
    private http = inject(HttpClient);
    private configService = inject(ConfigService);


  constructor() { }

  getUserBookList(userId: string): Observable<BookList> {
    return this.http.get<BookList>(`${this.configService.get('API_URL')}/users/${userId}/booklist`);
}
}
