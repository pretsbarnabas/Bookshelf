import { TestBed } from '@angular/core/testing';
import { UserService } from '../../app/services/page/user.service';
import { CrudService } from '../../app/services/global/crud.service';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { UserModel, UserRoot } from '../../app/models/User';
import { of } from 'rxjs';

describe('UserService', () => {
    let service: UserService;
    let crudService: CrudService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService
            ],
        }).compileComponents();
        crudService = TestBed.inject(CrudService);
        service = TestBed.inject(UserService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
        expect(service['crudService']).toBeDefined();
    });

    it('Should call crudService.getAll', () => {
        const pageSize = 10;
        const pageIndex = 1;
        const response: UserRoot = { data: [], pages: 0 };
        spyOn(crudService, 'getAll').and.returnValue(of(response));

        service.getAllUser(pageSize, pageIndex).subscribe(response => {
            expect(crudService.getAll).toHaveBeenCalledWith(`users?limit=${pageSize}&page=${pageIndex}`);
            expect(response).toEqual(response);
        });
    });

    it('Should call crudService.delete', () => {
        const userId = 'testId';
        spyOn(crudService, 'delete').and.returnValue(of({}));

        service.deleteUser(userId).subscribe(response => {
            expect(crudService.delete).toHaveBeenCalledWith('users', userId);
            expect(response).toEqual({});
        });
    });

    it('Should call crudService.update', () => {
        const modifiedUser: UserModel = { _id: 'testId', username: 'testUser', email: 'test@testing.com' } as UserModel;
        spyOn(crudService, 'update').and.returnValue(of({}));

        service.updateUser(modifiedUser._id, modifiedUser).subscribe(response => {
            expect(crudService.update).toHaveBeenCalledWith('users', modifiedUser._id, modifiedUser);
            expect(response).toEqual({});
        });
    });
});
