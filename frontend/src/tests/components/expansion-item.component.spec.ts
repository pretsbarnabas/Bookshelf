import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ExpansionItemComponent } from '../../app/utilities/components/all-type-display/expansion-item/expansion-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('ExpansionItemComponent', () => {
    let component: ExpansionItemComponent;
    let fixture: ComponentFixture<ExpansionItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ExpansionItemComponent,
                RouterTestingModule,
                TranslateModule.forRoot()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ExpansionItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('Should generate profile avatar if no image is provided', fakeAsync(() => {
        component.payload = {
            type: 'user', item: {
                _id: 'testId',
                username: 'testUser'
            }
        };
        component.ngOnChanges();
        tick();
        fixture.detectChanges();
        expect(component.payload.item.profile_image).toBeDefined();
    }));

    it('Should render different button on differing types', fakeAsync(() => {
        component.payload = {
            type: 'user', item: {
                _id: 'testId',
                username: 'testUser'
            }
        };
        component.ngOnChanges();
        tick();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.promote-demote')).toBeDefined();

        component.payload = {
            type: 'book', item: {
                _id: 'testId',
                title: 'testTitle'
            }
        };
        component.ngOnChanges();
        tick();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.edit')).toBeDefined();
    }));

    it('Should create a router-button for a book with the correct route', fakeAsync(() => {
        component.payload = {
            type: 'book', item: {
                _id: 'testId',
                title: 'testTitle'
            }
        };
        component.ngOnChanges();
        tick();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.visit')).toBeDefined();
        expect(fixture.nativeElement.querySelector('.visit').getAttribute('ng-reflect-router-link')).toEqual('/book-item,testId');
    }));

    it('Should open an ItemDialog component', () => {
        component.payload = {
            type: 'book', item: {
                _id: 'testId',
                title: 'testTitle'
            }
        };
        const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        mockDialogRef.afterClosed.and.returnValue(of(true));
        const openDialog = spyOn(component.dialog, 'open').and.returnValue(mockDialogRef);
        spyOn(ExpansionItemComponent.prototype, 'openDialog').and.callThrough();

        component.openDialog('delete');

        expect(openDialog).toHaveBeenCalled();
    });

    it('Should emit onDialogResultTrue when dialog returns true', () => {
        const fakeDialogRef = {
            afterClosed: () => of(true)
        };
        const dialogSpy = spyOn(component.dialog, 'open').and.returnValue(fakeDialogRef as any);
        spyOn(component.onDialogResultTrue, 'emit');

        component.payload = { type: 'user', item: { _id: 'testId', username: 'testUser', role: 'user' } };

        component.openDialog('delete');

        expect(dialogSpy).toHaveBeenCalled();
        expect(component.onDialogResultTrue.emit).toHaveBeenCalledWith({
            dialogType: 'delete',
            item: component.payload.item
        });
    });
});
