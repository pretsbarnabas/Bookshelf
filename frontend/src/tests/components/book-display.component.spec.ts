import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BookDisplayComponent } from '../../app/utilities/components/book-display/book-display.component';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { of, Subject } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import MockSummaryService from '../mocks/MockSummaryService';
import MockAuthService from '../mocks/MockAuthService';
import { DatePipe } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { BookService } from '../../app/services/page/book.service';
import { AuthService } from '../../app/services/global/auth.service';
import { MediaObserver } from '@angular/flex-layout';
import { SummaryService } from '../../app/services/page/summary.service';
import * as CryptoJS from "crypto-js";

class MockMediaObserver {
    asObservable() {
        return of([{ mqAlias: 'md', matches: true }]);
    }
}
class MockRouter {
    navigate = jasmine.createSpy('navigate');
}

describe('BookDisplayComponent', () => {
    let component: BookDisplayComponent;
    let fixture: ComponentFixture<BookDisplayComponent>;
    let router: Router;
    let bookService: BookService;
    let summaryService: SummaryService;
    let authService: MockAuthService;
    let mediaObserver: MockMediaObserver;
    let datePipe: DatePipe;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                BookDisplayComponent,
                TranslateModule.forRoot(),
                RouterModule.forRoot([])
            ],
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                { provide: 'SECRET_KEY', useValue: 'testkey123' },
                { provide: LOCALE_ID, useValue: 'en-US' },
                { provide: Router, useClass: MockRouter },
                { provide: AuthService, useClass: MockAuthService },
                { provide: MediaObserver, useClass: MockMediaObserver },
                DatePipe
            ]
        }).compileComponents();

        bookService = TestBed.inject(BookService);
        spyOn(bookService, 'getAllBooks').and.callFake((pageSize: number, pageIndex: number) => {
            component.books = [{ _id: 'TestId', title: 'TestTitle' } as any];
            component.maxPages = 1;
            return of({ data: component.books, pages: component.maxPages } as any);
        });
        summaryService = TestBed.inject(SummaryService);
        spyOn(summaryService, 'getAllSummaries').and.callFake((pageSize: number, pageIndex: number) => {
            component.summaries = [{ _id: 'TestId', content: 'TestContent' } as any];
            component.maxPages = 1;
            return of({ data: component.summaries, pages: component.maxPages } as any);
        });

        fixture = TestBed.createComponent(BookDisplayComponent);
        component = fixture.componentInstance;
        spyOn(component, 'fetchItems').and.callFake(() => {
            if (component.mode === 'books') {
                const page = component.pageSize;
                const index = component.currentPageIndex;
                return bookService.getAllBooks(page, index);
            } else {
                const page = component.pageSize;
                const index = component.currentPageIndex;
                return summaryService.getAllSummaries(page, index);
            }
        });

        router = TestBed.inject(Router);
        authService = TestBed.inject(AuthService) as unknown as MockAuthService;
        authService.loggedInUser$ = new Subject();
        mediaObserver = TestBed.inject(MediaObserver) as unknown as MockMediaObserver;
        datePipe = TestBed.inject(DatePipe);
        component.mode = 'books';

        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('Should fetch books', fakeAsync(() => {
        component.pageSize = 10;
        component.currentPageIndex = 0;
        component.mode = 'books';

        fixture.detectChanges();
        component.fetchItems();
        tick();
        fixture.detectChanges();

        expect(bookService.getAllBooks).toHaveBeenCalledWith(component.pageSize, component.currentPageIndex);
        expect(component.books.length).toBeGreaterThan(0);
        expect(component.maxPages).toBe(1);
    }));

    it('Should fetch summaries', fakeAsync(() => {
        component.mode = 'summaries';
        component.fetchItems();
        tick();
        fixture.detectChanges();

        expect(summaryService.getAllSummaries).toHaveBeenCalledWith(component.pageSize, component.currentPageIndex);
        expect(component.summaries.length).toBeGreaterThan(0);
        expect(component.maxPages).toBe(1);
    }));

    it('Should update page index and page size on changePage', fakeAsync(() => {
        const changes = { pageIndex: 2, pageSize: 20 };
        component.changePage(changes);
        tick();
        fixture.detectChanges();

        expect(component.currentPageIndex).toBe(2);
        expect(component.pageSize).toBe(20);
        expect(component.fetchItems).toHaveBeenCalled();
    }));

    it('Should navigate correctly to child page', () => {
        const encryptSpy = spyOn(CryptoJS.AES, 'encrypt').and.callFake((id: string, key: string) => {
            return {
                toString: () => `encrypted-${id}`
            } as any;
        });

        component.mode = 'books';
        component.navigateToBook('testBook');
        expect(router.navigate).toHaveBeenCalledWith(['/book-item', 'encrypted-testBook']);

        component.mode = 'summaries';
        component.navigateToBook('testSummary');
        expect(router.navigate).toHaveBeenCalledWith(['/summary-item', 'encrypted-testSummary']);
    });


    it('Should navigate to create correctly', () => {
        component.mode = 'books';
        component.navigateToCreate();
        expect(router.navigate).toHaveBeenCalledWith(['/create/book']);

        component.mode = 'summaries';
        component.navigateToCreate();
        expect(router.navigate).toHaveBeenCalledWith(['/create/summary']);
    });
});
