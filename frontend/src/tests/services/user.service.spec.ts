import { TestBed } from '@angular/core/testing';
import { UserService } from '../../app/services/page/user.service';
import { CrudService } from '../../app/services/global/crud.service';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService
            ],
        }).compileComponents();
        service = TestBed.inject(UserService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });
});
