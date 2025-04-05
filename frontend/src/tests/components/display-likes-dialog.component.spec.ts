import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayLikesDialogComponent } from '../../app/components/pages/book-item/review-display/display-likes-dialog/display-likes-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('DisplayLikesDialogComponent', () => {
    let component: DisplayLikesDialogComponent;
    let fixture: ComponentFixture<DisplayLikesDialogComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<DisplayLikesDialogComponent>>;

    beforeEach(async () => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            imports: [
                DisplayLikesDialogComponent,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { likes: [], dislikes: [] } },
                { provide: MatDialogRef, useValue: dialogRef },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DisplayLikesDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });
});
