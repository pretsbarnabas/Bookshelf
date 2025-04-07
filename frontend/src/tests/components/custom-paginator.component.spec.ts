import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomPaginatorComponent } from '../../app/utilities/components/custom-paginator/custom-paginator.component';
import { TranslateModule } from '@ngx-translate/core';

describe('CustomPaginatorComponent', () => {
    let component: CustomPaginatorComponent;
    let fixture: ComponentFixture<CustomPaginatorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CustomPaginatorComponent,
                TranslateModule.forRoot(),
            ]
        }).compileComponents();


        fixture = TestBed.createComponent(CustomPaginatorComponent);
        component = fixture.componentInstance;
        component.totalPages = 0;
        component.pageSize = 10;
        component.pageIndex = 0;
        component.pageSizeOptions = [5, 10, 20];
        component.itemType = 'user';
        component.showSortingMenu = false;
        component.isAdmin = false;
        component.prevPageSize = 10;
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('Should decrease pageIndex on goToPreviousPage', () => {
        spyOn(component.pageChanged, 'emit').and.callThrough();        

        component.pageIndex = 2;
        component.totalPages = 3;
        fixture.detectChanges();

        spyOn(CustomPaginatorComponent.prototype, 'goToPreviousPage').and.callThrough();
        component.goToPreviousPage();
        expect(component.pageIndex).toEqual(1);
        expect(component.pageChanged.emit).toHaveBeenCalled();

    });

    it('Should increase pageIndex on goToNextPage', () => {
        spyOn(component.pageChanged, 'emit').and.callThrough();        

        component.pageIndex = 0;
        component.totalPages = 2;
        fixture.detectChanges();

        spyOn(CustomPaginatorComponent.prototype, 'goToNextPage').and.callThrough();
        component.goToNextPage();
        expect(component.pageIndex).toEqual(1);
        expect(component.pageChanged.emit).toHaveBeenCalled();
    });

    it('Should go to pageIndex: 0 on goToFirstPage', () => {
        spyOn(component.pageChanged, 'emit').and.callThrough();        

        component.pageIndex = 8;
        component.totalPages = 10;
        fixture.detectChanges();

        spyOn(CustomPaginatorComponent.prototype, 'goToFirstPage').and.callThrough();
        component.goToFirstPage();
        expect(component.pageIndex).toEqual(0);
        expect(component.pageChanged.emit).toHaveBeenCalled();
    });

    it('Should set pageIndex to be equal to totalPages-1 on goToLastPage', () => {
        spyOn(component.pageChanged, 'emit').and.callThrough();        

        component.pageIndex = 3;
        component.totalPages = 10;
        fixture.detectChanges();

        spyOn(CustomPaginatorComponent.prototype, 'goToLastPage').and.callThrough();
        component.goToLastPage();
        expect(component.pageIndex).toEqual(10 - 1);
        expect(component.pageChanged.emit).toHaveBeenCalled();
    });

    it('Should reset pageIndex and emit pageChanged if a larger pageSize is set', () => {
        spyOn(CustomPaginatorComponent.prototype, 'onPageSizeChange').and.callThrough();        
        spyOn(component.pageChanged, 'emit').and.callThrough();        

        component.pageSize = 10;
        component.pageIndex = 2;
        fixture.detectChanges();

        component.pageSize = 25;
        component.onPageSizeChange();        

        expect(component.pageIndex).toEqual(0);
        expect(component.pageChanged.emit).toHaveBeenCalledWith({ pageIndex: 0, pageSize: 25 })
    })

    it('Should emit sortingChanged when emitSortingChanged is called', () => {
        spyOn(CustomPaginatorComponent.prototype, 'emitSortingChanged').and.callThrough();        
        spyOn(component.sortingChanged, 'emit').and.callThrough();        

        
        fixture.detectChanges();

        
        component.emitSortingChanged({ field: 'username', mode: 'desc' });        

        expect(component.emitSortingChanged).toHaveBeenCalledWith({ field: 'username', mode: 'desc' })        
        expect(component.sortingChanged.emit).toHaveBeenCalledWith({ field: 'username', mode: 'desc' })
    })

});
