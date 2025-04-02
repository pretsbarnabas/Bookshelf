import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from '../../app/components/pages/admin/admin.component';
import { CrudService } from '../../app/services/global/crud.service';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { AllTypeDisplayComponent } from '../../app/utilities/components/all-type-display/all-type-display.component';

describe('AdminComponent', () => {
    let component: AdminComponent;
    let fixture: ComponentFixture<AdminComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AdminComponent,
                TranslateModule.forRoot()
            ],
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AdminComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('Should have called all-type-display component in the html', ()=>{        
        expect(fixture.nativeElement.querySelector('all-type-display')).toBeDefined();
        
        const childComponent = fixture.debugElement.query(By.directive(AllTypeDisplayComponent)).componentInstance;
        expect(childComponent.isAdmin).toBeTrue();
    })
});
