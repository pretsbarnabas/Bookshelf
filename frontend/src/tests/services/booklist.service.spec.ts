import { TestBed } from '@angular/core/testing';
import { BooklistService } from '../../app/services/page/booklist.service';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';

describe('BooklistService', () => {
    let service: BooklistService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com'])
            ]
        }).compileComponents();
        service = TestBed.inject(BooklistService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });
});
