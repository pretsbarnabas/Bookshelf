import { inject, Injectable } from '@angular/core';
import { CrudService } from '../global/crud.service';
import { Observable } from 'rxjs';
import { Review, ReviewRoot } from '../../models/Review';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private crudService = inject(CrudService);

    constructor() { }

    getAllReviews(pageSize: number, pageIndex: number): Observable<ReviewRoot> {
        return this.crudService.getAll<ReviewRoot>(`reviews?limit=${pageSize}&page=${pageIndex}`);
    }
}
