import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ProfileComponent } from '../../app/components/pages/profile/profile.component';
import { TranslateModule } from '@ngx-translate/core';
import { CrudService } from '../../app/services/global/crud.service';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { AuthService } from '../../app/services/global/auth.service';
import { UserModel } from '../../app/models/User';
import MockAuthService from '../mocks/MockAuthService';
import { of, Subject } from 'rxjs';
import MockUserService from '../mocks/MockUserService';
import { UserService } from '../../app/services/page/user.service';
import { ActivatedRoute } from '@angular/router';

describe('ProfileComponent', () => {
    let component: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;

    let authService: MockAuthService;
    let userService: MockUserService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ProfileComponent,
                TranslateModule.forRoot(),
            ],
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService,
                { provide: AuthService, useClass: MockAuthService },
                { provide: UserService, useClass: MockUserService },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of({ get: (key: string) => 'testId' }),
                    }
                },
            ]
        }).compileComponents();

        authService = TestBed.inject(AuthService) as unknown as MockAuthService
        userService = TestBed.inject(UserService) as unknown as MockUserService
        TestBed.inject(ActivatedRoute);
        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('Should set userId from paramMap', () => {
        expect(component.userId).toEqual('testId');
    });

    it('Should update user data when auth service emits', fakeAsync(() => {        
        const testUser = { username: 'test', role: 'user' } as UserModel;

        component.ngOnInit();
        tick();
        authService.loggedInUser$.next(testUser);
        fixture.detectChanges();

        expect(component.loggedInUser).toEqual(testUser);
    }));

    it('Should open a dialog on profile edit request', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        const testUser: UserModel = { _id: 'testId', username: 'testUser', email: 'test@testing.com' } as UserModel;
        component.loggedInUser = testUser;

        const dialogRef = {
            afterClosed: () => of({ result: true, modifiedData: { email: 'new@email.com' } })
        };
        spyOn(component.dialog, 'open').and.returnValue(dialogRef as any);

        component.handleProfile('edit');

        expect(userService.updateUser).toHaveBeenCalledWith(testUser._id, { email: 'new@email.com' });
    });
});
