import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BookItemComponent } from '../../app/components/pages/book-item/book-item.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { TranslateModule } from '@ngx-translate/core';
import { CrudService } from '../../app/services/global/crud.service';
import { BookService } from '../../app/services/page/book.service';
import { ReviewService } from '../../app/services/page/review.service';
import { AuthService } from '../../app/services/global/auth.service';
import { TranslationService } from '../../app/services/global/translation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

class MockMatSnackBar {
    open = jasmine.createSpy('open');
}

describe('BookItemComponent', () => {
    let component: BookItemComponent;
    let fixture: ComponentFixture<BookItemComponent>;
    let bookService: BookService
    let reviewService: ReviewService
    let authService: AuthService
    let translationService: TranslationService;
    let snackBar: MockMatSnackBar;
    let router: Router

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                BookItemComponent,
                TranslateModule.forRoot()
            ],
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { paramMap: { get: () => '/book-item' } },
                        queryParams: of({ id: 'testValue' }),
                    },
                },
                BookService,
                ReviewService,
                AuthService,
                TranslationService,
                { provide: MatSnackBar, useClass: MockMatSnackBar },
                Router
            ]
        }).compileComponents();

        bookService = TestBed.inject(BookService);
        reviewService = TestBed.inject(ReviewService);
        authService = TestBed.inject(AuthService);
        translationService = TestBed.inject(TranslationService);
        snackBar = TestBed.inject(MatSnackBar) as unknown as MockMatSnackBar;
        router = TestBed.inject(Router);
        spyOn(bookService, 'getReviewsByBook').and.callFake((book_id: any, index: number, size: number): any => {
            component.reviews = [
                {
                    _id: 'testId',
                    content: 'testContent'
                } as any
            ]
            component.maxPages = 1;
        });
        spyOn(BookItemComponent.prototype, 'fillreviews').and.callFake(() => {
            bookService.getReviewsByBook(component.bookId, 0, 5);
        });
        spyOn(BookItemComponent.prototype, 'ngOnInit').and.callFake(() => {
            bookService.getBookById(component.bookId);
        });

        fixture = TestBed.createComponent(BookItemComponent);
        component = fixture.componentInstance;
        spyOn(bookService, 'getBookById').and.callFake((book_id: any): any => {
            component.book = { _id: 'testId', title: 'testTitle' };
            return of({ _id: 'testId', title: 'testTitle' })
        })
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('Should fetch book', fakeAsync(() => {
        component.ngOnInit();
        tick();
        fixture.detectChanges();

        expect(component.book).toBeTruthy();
        expect(component.book._id).toEqual('testId');
    }));

    it('Should fetch reviews', fakeAsync(() => {
        component.fillreviews();
        tick();
        fixture.detectChanges();
        expect(component.reviews.length).toBeGreaterThan(0);
        expect(component.maxPages).toBe(1);
    }));

    it('Should open snackBar', fakeAsync(async () => {
        spyOn(translationService.service, 'get').and.returnValue(of('BOOKITEM.SNACKBAR.RATED'));
        const promise = component.onClick(4);
        tick();
        fixture.detectChanges();
        expect(snackBar.open).toHaveBeenCalledWith('BOOKITEM.SNACKBAR.RATED 4 / ' + component.starCount, '', jasmine.any(Object));
        expect(component.rating).toBe(4);
        await promise;
    }));

    it('Should navigate back to /books', () => {
        spyOn(router, 'navigate').and.callThrough();
        spyOn(component, 'onBack').and.callFake(() => {
            router.navigate(['/books'])
        })
        component.onBack();
        expect(router.navigate).toHaveBeenCalledWith(['/books']);
    });

    it('Should submit review', fakeAsync(async () => {
        component.loggedInUser = { _id: 'user123' } as any;
        component.reviewForm.patchValue({ content: 'Great book!' });
        component.uniqueUserIds = [];
        spyOn(bookService, 'Addreview').and.returnValue(of({ _id: 'newReview' } as any));        

        await component.onSubmitReview();
        tick(1000);
        fixture.detectChanges();

        expect(bookService.Addreview).toHaveBeenCalled();
        expect(component.reviewForm.value.content).toEqual(null);
        expect(component.fillreviews).toHaveBeenCalled();
    }));

    it('Should navigate to create', () => {
        spyOn(router, 'navigate').and.callThrough();
        spyOn(component, 'navigateToCreate').and.callFake(() => {
            router.navigate(['/create/summary', 'testId'])
        })
        component.book = { _id: 'testId' } as any;
        component.navigateToCreate();
        expect(router.navigate).toHaveBeenCalledWith(['/create/summary', 'testId']);
    });
});
