import { inject, Injectable } from '@angular/core';
import { CrudService } from '../global/crud.service';
import { Observable } from 'rxjs';
import { CommentRoot } from '../../models/Comment';

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private crudService = inject(CrudService);

    constructor() { }

    getAllcomments(pageSize: number, pageIndex: number): Observable<CommentRoot> {
        return this.crudService.getAll<CommentRoot>(`comments?limit=${pageSize}&page=${pageIndex}`);
    }

    deleteComments(_id: number | string) {
        return this.crudService.delete('comments', _id)
    }
}
