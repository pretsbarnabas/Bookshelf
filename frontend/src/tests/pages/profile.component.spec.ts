import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from '../../app/components/pages/profile/profile.component';
import { TranslateModule } from '@ngx-translate/core';
import { CrudService } from '../../app/services/global/crud.service';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { AuthService } from '../../app/services/global/auth.service';
import { UserModel } from '../../app/models/User';
import MockAuthService from '../mocks/MockAuthService';
import { of } from 'rxjs';
import MockUserService from '../mocks/MockUserService';
import { UserService } from '../../app/services/page/user.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfileComponent', () => {
    let component: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;

    let authService: MockAuthService;
    let userService: MockUserService;
    let dialog: jasmine.SpyObj<MatDialog>;

    const secretKey = 'testkey123';
    const rawEncryptedId = 'encryptedIdValue';
    const expectedDecryptedId = 'decryptedId';

    beforeEach(async () => {
        dialog = jasmine.createSpyObj('MatDialog', ['open']);

        await TestBed.configureTestingModule({
            imports: [
                ProfileComponent,
                TranslateModule.forRoot(),
                MatDialogModule,
                RouterTestingModule
            ],
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                { provide: 'SECRET_KEY', useValue: secretKey },
                CrudService,
                { provide: AuthService, useClass: MockAuthService },
                { provide: UserService, useClass: MockUserService },
                { provide: MatDialog, useValue: dialog },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of<ParamMap>({
                            get: (key: string) => key === 'id' ? rawEncryptedId : null
                        } as any)
                    },
                },
            ]
        }).compileComponents();

        authService = TestBed.inject(AuthService) as unknown as MockAuthService;
        userService = TestBed.inject(UserService) as unknown as MockUserService;

        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;

        spyOn(CryptoJS.AES, 'decrypt').and.callFake((ciphertext: string, key: string) => {
            if (key === secretKey && ciphertext === 'encryptedIdValue') {
                return {
                    toString: (encoding: any) => expectedDecryptedId
                } as any;
            }
            return {
                toString: () => ''
            } as any;
        });

        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('Should open a dialog on profile edit request and update user via decrypted id', () => {
        const testUser: UserModel = { _id: expectedDecryptedId, username: 'testUser', email: 'test@testing.com' } as UserModel;
        component.loggedInUser = testUser;

        dialog.open.and.returnValue({
            afterClosed: () => of({ result: true, modifiedData: { email: 'new@email.com' } })
        } as any);

        component.handleProfile('edit');

        expect(userService.updateUser).toHaveBeenCalledWith(expectedDecryptedId, { email: 'new@email.com' });
    });
});
