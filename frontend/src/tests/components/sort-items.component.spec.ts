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
        fixture.detectChanges();
    });
    
    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });
    
    it('Should get the correct field mapping', () =>{
        spyOn(SortItemsComponent.prototype, 'ngOnChanges').and.callThrough();        
        component.type = 'summary';
        component.isAdmin = false;
        component.ngOnChanges();        
        expect(component.sortedFields).toEqual(['updated_at',])

        
        component.type = 'review';
        component.isAdmin = true;
        component.ngOnChanges();
        expect(component.sortedFields).toEqual(['_id', 'user._id', 'score', 'created_at', 'updated_at'])
    });

    it('Should emit selected field', ()=>{
        spyOn(SortItemsComponent.prototype, 'emitChangedValue').and.callThrough();
        spyOn(component.onSortingChanged, 'emit');
        component.selectedField = '_id';
        component.mode = 'asc';

        component.emitChangedValue();
        expect(component.onSortingChanged.emit).toHaveBeenCalledWith({field: '_id', mode: 'asc'});
        
    });
});
