import { TestBed } from '@angular/core/testing';
import { CommentService } from '../../app/services/page/comment.service';
import { CrudService } from '../../app/services/global/crud.service';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { CommentModel, CommentRoot } from '../../app/models/Comment';
import { of } from 'rxjs';

describe('CommentService', () => {
    let service: CommentService;
    let crudService: CrudService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService
            ],
        }).compileComponents();
        crudService = TestBed.inject(CrudService);
        service = TestBed.inject(CommentService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
        expect(service['crudService']).toBeDefined();
    });

    it('Should call crudService.getAll', () => {
        const pageSize = 10;
        const pageIndex = 1;
        const response: CommentRoot = { data: [], pages: 0 };
        spyOn(crudService, 'getAll').and.returnValue(of(response));

        service.getAllcomments(pageSize, pageIndex).subscribe(response => {
            expect(crudService.getAll).toHaveBeenCalledWith(`comments?limit=${pageSize}&page=${pageIndex}`);
            expect(response).toEqual(response);
        });
    });

    it('Should call crudService.delete', () => {
        const commentId = 'testId';
        spyOn(crudService, 'delete').and.returnValue(of({}));

        service.deleteComment(commentId).subscribe(response => {
            expect(crudService.delete).toHaveBeenCalledWith('comments', commentId);
            expect(response).toEqual({});
        });
    });

    it('Should call crudService.update', () => {
        const modifiedComment: CommentModel = { _id: 'testId', content: 'testContent' } as CommentModel;
        spyOn(crudService, 'update').and.returnValue(of({}));
        service.updateComment(modifiedComment._id, modifiedComment).subscribe(response => {
            expect(crudService.update).toHaveBeenCalledWith('comments', modifiedComment._id, modifiedComment);
            expect(response).toEqual({});
        });
    });
});
