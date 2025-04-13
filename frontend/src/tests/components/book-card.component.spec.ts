import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookCardComponent } from '../../app/components/pages/mylist/book-card/book-card.component';
import { TranslateModule } from '@ngx-translate/core';

describe('BookCardComponent', () => {
    let component: BookCardComponent;
    let fixture: ComponentFixture<BookCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                BookCardComponent,
                TranslateModule.forRoot(),
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(BookCardComponent);
        component = fixture.componentInstance;
        component.book = { _id: 'testId', title: 'testTitle' }
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should emit startReading with book ID when Start Reading is clicked', () => {
        spyOn(component.startReading, 'emit');
        component.book = { _id: 'testId' };
        component.onStartReading();
        expect(component.startReading.emit).toHaveBeenCalledWith('testId');
    });

    it('should emit dropBook with book ID when Drop book is clicked', () => {
        spyOn(component.dropBook, 'emit');
        component.book = { _id: 'testId' };
        component.onDropBook();
        expect(component.dropBook.emit).toHaveBeenCalledWith('testId');
    });

    it('should emit finishReading with book ID when Finish Reading is clicked', () => {
        spyOn(component.finishReading, 'emit');
        component.book = { _id: 'testId' };
        component.onFinishReading();
        expect(component.finishReading.emit).toHaveBeenCalledWith('testId');
    });

    it('should emit markAsFavorite with book ID when Mark as favourite is clicked', () => {
        spyOn(component.markAsFavorite, 'emit');
        component.book = { _id: 'testId' };
        component.onMarkAsFavorite();
        expect(component.markAsFavorite.emit).toHaveBeenCalledWith('testId');
    });

    it('should emit deleteBook with book ID when Delete book is clicked', () => {
        spyOn(component.deleteBook, 'emit');
        component.book = { _id: 'testId' };
        component.onDeleteBook();
        expect(component.deleteBook.emit).toHaveBeenCalledWith('testId');
    });

    it('should emit backToRead with book ID when Back to reading is clicked', () => {
        spyOn(component.backToRead, 'emit');
        component.book = { _id: 'testId' };
        component.onbackToRead();
        expect(component.backToRead.emit).toHaveBeenCalledWith('testId');
    });

    it('should emit backToReading with book ID when Back to Reading is clicked', () => {
        spyOn(component.backToReading, 'emit');
        component.book = { _id: 'testId' };
        component.onbackToReading();
        expect(component.backToReading.emit).toHaveBeenCalledWith('testId');
    });

});
