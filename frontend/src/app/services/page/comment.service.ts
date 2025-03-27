import { inject, Injectable } from '@angular/core';
import { CrudService } from '../global/crud.service';
import { Observable } from 'rxjs';
import { CommentModel, CommentRoot } from '../../models/Comment';

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private crudService = inject(CrudService);

    constructor() { }

    getAllcomments(pageSize: number, pageIndex: number, userId?: number | string): Observable<CommentRoot> {
        return this.crudService.getAll<CommentRoot>(`comments?limit=${pageSize}&page=${pageIndex} + ${userId ? `&user_id=${userId}`: ''}`);
    }

    deleteComment(_id: number | string): Observable<any> {
        return this.crudService.delete('comments', _id)
    }

    updateComment(_id: number | string, data: CommentModel): Observable<any> {
        return this.crudService.update('comments', _id, data);
    }
}
