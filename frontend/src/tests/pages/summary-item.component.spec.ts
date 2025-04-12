import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SummaryItemComponent } from '../../app/components/pages/summary-item/summary-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { CrudService } from '../../app/services/global/crud.service';
import { of, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SummaryService } from '../../app/services/page/summary.service';

describe('SummaryItemComponent', () => {
    let component: SummaryItemComponent;
    let fixture: ComponentFixture<SummaryItemComponent>;
    let summaryService: SummaryService

    let router: Router;

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [
                SummaryItemComponent,
                TranslateModule.forRoot(),
            ],
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { paramMap: { get: () => '/summary-item' } },
                        queryParams: of({ id: 'testId' }),
                    },
                },
                SummaryService
            ]
        }).compileComponents();

        summaryService = TestBed.inject(SummaryService);
        spyOn(summaryService, 'getSummaryById').and.callFake((id: any): any => {
            return of({ _id: 'testId', content: 'testContent' });
        })
        fixture = TestBed.createComponent(SummaryItemComponent);
        TestBed.inject(ActivatedRoute);
        router = TestBed.inject(Router);
        component = fixture.componentInstance;
        spyOn(SummaryItemComponent.prototype, 'ngOnInit').and.callFake(() => {
            component.summaryId = 'testId';
            summaryService.getSummaryById(component.summaryId!);
        });
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });
    

    it('Should navigate back to /summaries', () => {
        spyOn(router, 'navigate').and.callThrough();
        spyOn(component, 'onBack').and.callFake(() => {
            router.navigate(['/summaries'])
        })
        component.onBack();
        expect(router.navigate).toHaveBeenCalledWith(['/summaries']);
    });
});
