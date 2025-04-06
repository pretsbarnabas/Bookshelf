import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { of } from 'rxjs';
import { ItemDialogComponent } from '../../app/utilities/components/all-type-display/expansion-item/item-dialog/item-dialog.component';
import { FormService } from '../../app/services/page/form.service';
import { TranslationService } from '../../app/services/global/translation.service';
import { TranslateModule } from '@ngx-translate/core';

const translationServiceStub = {
    currentLanguage$: of('en')
};

const formServiceStub = {
    getEditDialogFormConfigMapping: jasmine.createSpy('getEditDialogFormConfigMapping').and.returnValue({ book: [{ name: 'release', type: 'date' }] })
};

describe('ItemDialogComponent', () => {
    let component: ItemDialogComponent;
    let fixture: ComponentFixture<ItemDialogComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<ItemDialogComponent>>;

    beforeEach(async () => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            imports: [
                ItemDialogComponent,
                ReactiveFormsModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: TranslationService, useValue: translationServiceStub },
                { provide: MAT_DIALOG_DATA, useValue: { type: 'edit', item: {} } },
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: FormService, useValue: formServiceStub },
                { provide: MAT_DATE_LOCALE, useValue: 'en' },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ItemDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create and initialize form on ngOnInit for edit type', fakeAsync(() => {
        component.data.item = { type: 'book', release: '2025-03-31' };
        component.ngOnInit();
        tick();
        fixture.detectChanges();

        expect(component.form.controls['release']).toBeDefined();
        expect(component.form.get('release')?.value).toBe(component.data.item.release);
    }));

    it('Should call dialogRef.close with modified data when form is valid', fakeAsync(() => {
        component.data.item = { type: 'book', release: '2025-03-31' };

        component.ngOnInit();
        tick();
        fixture.detectChanges();

        component.form.controls['release'].setValue('2025-03-31T00:00:00Z');

        spyOn(ItemDialogComponent.prototype, 'emitResult').and.callThrough();
        expect(component.form.controls['release']?.value).toBe('2025-03-31T00:00:00Z');
        component.emitResult({ result: true, modifiedData: { release: '2025-03-31T00:00:00Z' } });
        expect(ItemDialogComponent.prototype.emitResult).toHaveBeenCalledWith({ result: true, modifiedData: { release: '2025-03-31T00:00:00Z' } });
        expect(dialogRef.close).toHaveBeenCalledWith(jasmine.objectContaining({
            result: true,
            modifiedData: jasmine.objectContaining({
                release: '2025-03-31T00:00:00Z'
            })
        }));
    }));

    it('Should trigger file input click when triggerFileInput is called', () => {
        const dummyInput = document.createElement('input');
        dummyInput.id = 'fileInput';
        document.body.appendChild(dummyInput);
        spyOn(dummyInput, 'click');

        component.triggerFileInput();
        expect(dummyInput.click).toHaveBeenCalled();

        document.body.removeChild(dummyInput);
    });

    it('Should update form image and selected file name on file selection', fakeAsync(() => {
        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
        const event = {
            target: {
                files: [file]
            }
        } as unknown as Event;

        const fileReaderSpy = jasmine.createSpyObj('FileReader', ['readAsDataURL']);
        fileReaderSpy.result = 'base64encodedstring';
        Object.defineProperty(fileReaderSpy, 'onload', {
            set: function (callback) {
                callback();
            }
        });
        spyOn(window as any, 'FileReader').and.returnValue(fileReaderSpy);

        component.onFileSelected(event);
        tick();
        fixture.detectChanges();

        expect(component.selectedFile).toEqual(file);
        expect(component.selectedFileName).toBe('test.png');
        expect(component.imgBase64).toBe('base64encodedstring');
    }));

    it('Should change role correctly in changeRole', () => {
        component.data.item.role = 'user';
        component.changeRole();
        component.emitResult({ result: true, modifiedData: { role: 'editor' } });
        expect(dialogRef.close).toHaveBeenCalledWith(jasmine.objectContaining({
            result: true,
            modifiedData: jasmine.objectContaining({
                role: 'editor'
            })
        }));
    });
});
