import { TestBed } from '@angular/core/testing';
import { ConfigService, provideConfig } from '../../app/services/global/config.service';
import { provideHttpClient } from '@angular/common/http';
import { CrudService } from '../../app/services/global/crud.service';

describe('ConfigService', () => {
    let service: ConfigService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService
            ],
        }).compileComponents();
        TestBed.configureTestingModule({});
        service = TestBed.inject(ConfigService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });
});
