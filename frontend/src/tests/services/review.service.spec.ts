import { TestBed } from '@angular/core/testing';
import { ReviewService } from '../../app/services/page/review.service';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { CrudService } from '../../app/services/global/crud.service';
import { ReviewModel, ReviewRoot } from '../../app/models/Review';
import { of } from 'rxjs';

describe('ReviewService', () => {
    let service: ReviewService;
    let crudService: CrudService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService
            ]
        }).compileComponents();
        crudService = TestBed.inject(CrudService);
        service = TestBed.inject(ReviewService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
        expect(service['crudService']).toBeDefined();
    });

    it('Should call crudService.getAll', () => {
        const pageSize = 10;
        const pageIndex = 1;
        const response: ReviewRoot = { data: [], pages: 0 };
        spyOn(crudService, 'getAll').and.returnValue(of(response));

        service.getAllReviews(pageSize, pageIndex).subscribe(response => {
            expect(crudService.getAll).toHaveBeenCalledWith(`reviews?limit=${pageSize}&page=${pageIndex}`);
            expect(response).toEqual(response);
        });
    });

    it('Should call crudService.delete', () => {
        const reviewId = 'testId';
        spyOn(crudService, 'delete').and.returnValue(of({}));

        service.deleteReview(reviewId).subscribe(response => {
            expect(crudService.delete).toHaveBeenCalledWith('reviews', reviewId);
            expect(response).toEqual({});
        });
    });

    it('Should call crudService.update', () => {
        const modifiedReview: ReviewModel = { _id: 'testId', score: 4, content: 'testContent' } as ReviewModel;
        spyOn(crudService, 'update').and.returnValue(of({}));
        service.updateReview(modifiedReview._id, modifiedReview).subscribe(response => {
            expect(crudService.update).toHaveBeenCalledWith('reviews', modifiedReview._id, modifiedReview);
            expect(response).toEqual({});
        });
    });
});
