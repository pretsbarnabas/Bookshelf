import { TestBed } from '@angular/core/testing';
import { CommentService } from '../../app/services/page/comment.service';
import { CrudService } from '../../app/services/global/crud.service';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';

describe('CommentService', () => {
    let service: CommentService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService
            ],
        }).compileComponents();
        service = TestBed.inject(CommentService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });
});
