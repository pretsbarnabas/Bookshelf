import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SortItemsComponent } from '../../app/utilities/components/sort-items/sort-items.component';
import { TranslateModule } from '@ngx-translate/core';



describe('SortItemsComponent', () => {
    let component: SortItemsComponent;
    let fixture: ComponentFixture<SortItemsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                SortItemsComponent,
                TranslateModule.forRoot(),
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SortItemsComponent);
        component = fixture.componentInstance;
        component.type = 'user';
        component.isAdmin = false;
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });

    
});
