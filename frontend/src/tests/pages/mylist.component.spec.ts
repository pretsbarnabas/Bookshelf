import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MylistComponent } from '../../app/components/pages/mylist/mylist.component';
import { BooklistService } from '../../app/services/page/booklist.service';
import { AuthService } from '../../app/services/global/auth.service';
import { TranslateModule } from '@ngx-translate/core';

const mockUser = { _id: 'testId' };
const mockBookList = [
    { book: { _id: 'testBook' }, read_status: 'to_read' },
    { book: { _id: 'book2' }, read_status: 'has_read' },
    { book: { _id: 'book3' }, read_status: 'favorite' }
];

class MockAuthService {
    loggedInUser$ = of(mockUser);
}

class MockBooklistService {
    getUserBookList = jasmine.createSpy().and.returnValue(of(mockBookList));
    updateBookStatus = jasmine.createSpy().and.returnValue(of({}));
}

describe('MylistComponent', () => {
    let component: MylistComponent;
    let fixture: ComponentFixture<MylistComponent>;
    let booklistService: BooklistService;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                MylistComponent,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: BooklistService, useClass: MockBooklistService },
                { provide: AuthService, useClass: MockAuthService },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MylistComponent);
        component = fixture.componentInstance;
        booklistService = TestBed.inject(BooklistService);
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('Should call fetchUserBookList on init', () => {
        const spy = spyOn(component as any, 'fetchUserBookList').and.callThrough();
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });


    it('Should fetch and categorize books on init', () => {
        expect(component.bookList?.length).toBe(3);
        expect(component.toReadBooks.length).toBe(1);
        expect(component.hasReadBooks.length).toBe(2);
        expect(component.favoriteBooks.length).toBe(1);
    });

    it('Should update book status to "to_read"', () => {
        component.ToRead('testBook');
        expect(booklistService.updateBookStatus).toHaveBeenCalledWith('testId', 'testBook', 'to_read');
    });

    it('Should update book status to "is_reading"', () => {
        component.startReading('testBook');
        expect(booklistService.updateBookStatus).toHaveBeenCalledWith('testId', 'testBook', 'is_reading');
    });

    it('Should update book status to "has_read"', () => {
        component.finishReading('testBook');
        expect(booklistService.updateBookStatus).toHaveBeenCalledWith('testId', 'testBook', 'has_read');
    });

    it('Should update book status to "dropped"', () => {
        component.dropBook('testBook');
        expect(booklistService.updateBookStatus).toHaveBeenCalledWith('testId', 'testBook', 'dropped');
    });

    it('Should update book status to "favorite"', () => {
        component.markAsFavorite('testBook');
        expect(booklistService.updateBookStatus).toHaveBeenCalledWith('testId', 'testBook', 'favorite');
    });

    it('Should update book status to "delete"', () => {
        component.deleteBook('testBook');
        expect(booklistService.updateBookStatus).toHaveBeenCalledWith('testId', 'testBook', 'delete');
    });

    it('Should handle book status update error', () => {
        (booklistService.updateBookStatus as jasmine.Spy).and.returnValue(throwError(() => new Error('fail')));
        spyOn(console, 'error');
        component.finishReading('book2');
        expect(console.error).toHaveBeenCalled();
    });

});
