import { TestBed } from '@angular/core/testing';
import { ReviewService } from '../../app/services/page/review.service';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { CrudService } from '../../app/services/global/crud.service';

describe('ReviewService', () => {
    let service: ReviewService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService
            ]
        }).compileComponents();
        service = TestBed.inject(ReviewService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });
});
