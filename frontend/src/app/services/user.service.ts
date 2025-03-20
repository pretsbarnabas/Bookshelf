import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { UserLoggedInModel } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

constructor(     
  private http: HttpClient,
  private configService: ConfigService) { }


    getUserById(user_id: string): Observable<any> {
        return this.http.get<UserLoggedInModel>(`${this.configService.get('API_URL')}/api/users/${user_id}`);
      }
    }