import { TestBed } from '@angular/core/testing';
import { CacheService } from '../../app/services/global/cache.service';

describe('CacheService', () => {
    let service: CacheService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CacheService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });
});
