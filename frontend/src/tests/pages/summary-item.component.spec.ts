import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SummaryItemComponent } from '../../app/components/pages/summary-item/summary-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { CrudService } from '../../app/services/global/crud.service';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SummaryService } from '../../app/services/page/summary.service';
import * as CryptoJS from 'crypto-js';

const secretKey = 'testkey123';
const realId = 'testId';
const encryptedId = CryptoJS.AES.encrypt(realId, secretKey).toString();

describe('SummaryItemComponent', () => {
    let component: SummaryItemComponent;
    let fixture: ComponentFixture<SummaryItemComponent>;
    let summaryService: SummaryService;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                SummaryItemComponent,
                TranslateModule.forRoot(),
                RouterTestingModule
            ],
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: (key: string) => {
                                    return key === 'id' ? encryptedId : null;
                                }
                            }
                        },
                        queryParams: of({})
                    },
                },
                SummaryService
            ]
        }).compileComponents();

        summaryService = TestBed.inject(SummaryService);
        spyOn(summaryService, 'getSummaryById').and.callFake((id: any): any => {
            return of({ _id: id, content: 'testContent' });
        });

        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(SummaryItemComponent);
        component = fixture.componentInstance;

        spyOn(CryptoJS.AES, 'decrypt').and.callFake((ciphertext: string, key: string) => {
            return {
                toString: (enc: any) => realId
            } as any;
        });

        fixture.detectChanges();
    });

    it('should create the component and correctly decrypt the id', fakeAsync(() => {
        tick();
        expect(component).toBeTruthy();
        expect(component.summaryId).toBe(realId);

        expect(summaryService.getSummaryById).toHaveBeenCalledWith(realId);
    }));

    it('should navigate back to /summaries', () => {
        spyOn(router, 'navigate').and.callThrough();
        component.onBack();
        expect(router.navigate).toHaveBeenCalledWith(['/summaries']);
    });
});
