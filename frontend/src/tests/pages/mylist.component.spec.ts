import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MylistComponent } from '../../app/components/pages/mylist/mylist.component';
import { TranslateModule } from '@ngx-translate/core';
import { CrudService } from '../../app/services/global/crud.service';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';

describe('MylistComponent', () => {
    let component: MylistComponent;
    let fixture: ComponentFixture<MylistComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MylistComponent,
                TranslateModule.forRoot()
            ],
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MylistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });
});
