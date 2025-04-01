import { TestBed } from '@angular/core/testing';
import { SummaryService } from '../../app/services/page/summary.service';
import { CrudService } from '../../app/services/global/crud.service';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';

describe('SummaryService', () => {
    let service: SummaryService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService
            ],
        }).compileComponents();
        service = TestBed.inject(SummaryService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });
});
