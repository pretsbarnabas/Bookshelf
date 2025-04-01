import { TestBed } from '@angular/core/testing';
import { ThemeService } from '../../app/services/global/theme.service';

describe('ThemeService', () => {
    let service: ThemeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ThemeService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });
});
