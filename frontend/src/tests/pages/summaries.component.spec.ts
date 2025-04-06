import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummariesComponent } from '../../app/components/pages/summaries/summaries.component';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { CrudService } from '../../app/services/global/crud.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('SummariesComponent', () => {
    let component: SummariesComponent;
    let fixture: ComponentFixture<SummariesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                SummariesComponent,
                TranslateModule.forRoot()
            ],
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { paramMap: { get: () => '/summary-item' } },
                        queryParams: of({ test: 'testValue' }),
                    },
                },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SummariesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });
});
