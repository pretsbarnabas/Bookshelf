import { TestBed } from '@angular/core/testing';
import { CrudService } from '../../app/services/global/crud.service';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';

describe('CrudService', () => {
    let service: CrudService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
            ],
        }).compileComponents();
        service = TestBed.inject(CrudService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });
});
