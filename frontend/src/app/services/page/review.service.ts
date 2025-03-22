import { inject, Injectable } from '@angular/core';
import { CrudService } from '../global/crud.service';
import { Observable } from 'rxjs';
import { ReviewModel, ReviewRoot } from '../../models/Review';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private crudService = inject(CrudService);

    constructor() { }

    getAllReviews(pageSize: number, pageIndex: number): Observable<ReviewRoot> {
        return this.crudService.getAll<ReviewRoot>(`reviews?limit=${pageSize}&page=${pageIndex}`);
    }

    deleteReview(_id: number | string): Observable<any>  {
        return this.crudService.delete('reviews', _id)
    }

    updateReview(data: ReviewModel): Observable<any>  {
        return this.crudService.update('reviews', data);
    }
}
