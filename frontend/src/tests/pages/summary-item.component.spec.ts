import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryItemComponent } from '../../app/components/pages/summary-item/summary-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { CrudService } from '../../app/services/global/crud.service';

describe('SummaryItemComponent', () => {
    let component: SummaryItemComponent;
    let fixture: ComponentFixture<SummaryItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                SummaryItemComponent,
                TranslateModule.forRoot()
            ],
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SummaryItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });
});
