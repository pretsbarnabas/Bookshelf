import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})
export class BookService {

    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) { }

    getAllBooks(): Observable<any> {
        return this.http.get<any>(`${this.configService.get('API_URL')}/api/books`);

    }
}
