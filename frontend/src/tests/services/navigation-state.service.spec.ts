import { TestBed } from '@angular/core/testing';
import { NavigationStateService } from '../../app/services/global/navigation-state.service';

describe('NavigationStateService', () => {
    let service: NavigationStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NavigationStateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
