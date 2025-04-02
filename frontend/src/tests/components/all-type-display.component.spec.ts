import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AllTypeDisplayComponent } from '../../app/utilities/components/all-type-display/all-type-display.component';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../app/services/global/auth.service';
import { UserService } from '../../app/services/page/user.service';
import { BookService } from '../../app/services/page/book.service';
import { ReviewService } from '../../app/services/page/review.service';
import { SummaryService } from '../../app/services/page/summary.service';
import { CommentService } from '../../app/services/page/comment.service';
import MockAuthService from '../mocks/MockAuthService';
import MockUserService from '../mocks/MockUserService';
import MockBookService from '../mocks/MockBookService';
import MockReviewService from '../mocks/MockReviewService';
import MockSummaryService from '../mocks/MockSummaryService';
import MockCommentService from '../mocks/MockCommentService';
import { UserModel } from '../../app/models/User';
import { ExpansionItemComponent } from '../../app/utilities/components/all-type-display/expansion-item/expansion-item.component';
import { By } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('AllTypeDisplayComponent', () => {
    let authService: MockAuthService;
    let userService: MockUserService;
    let bookService: MockBookService;
    let reviewService: MockReviewService;
    let summaryService: MockSummaryService;
    let commentService: MockCommentService;
    let component: AllTypeDisplayComponent;
    let fixture: ComponentFixture<AllTypeDisplayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AllTypeDisplayComponent,
                BrowserAnimationsModule,
                ExpansionItemComponent,
                TranslateModule.forRoot(),
            ],
            providers: [
                { provide: AuthService, useClass: MockAuthService },
                { provide: UserService, useClass: MockUserService },
                { provide: BookService, useClass: MockBookService },
                { provide: ReviewService, useClass: MockReviewService },
                { provide: SummaryService, useClass: MockSummaryService },
                { provide: CommentService, useClass: MockCommentService },
            ]
        }).compileComponents();

        authService = TestBed.inject(AuthService) as unknown as MockAuthService;
        userService = TestBed.inject(UserService) as unknown as MockUserService;
        bookService = TestBed.inject(BookService) as unknown as MockBookService;
        reviewService = TestBed.inject(ReviewService) as unknown as MockReviewService;
        summaryService = TestBed.inject(SummaryService) as unknown as MockSummaryService;
        commentService = TestBed.inject(CommentService) as unknown as MockCommentService;

        fixture = TestBed.createComponent(AllTypeDisplayComponent);
        component = fixture.componentInstance;

        component.fetchedArray = [];
        component.currentArrayInPaginator = [];
        component.itemType = 'user';
        component.currentSortSettings = { field: '', mode: 'asc' }

        component.currentArrayType = 'users';

        component.maxPages = 0;
        component.currentPageIndex = 0;
        component.pageSize = 10;
        spyOn(component, 'changePaginatedArray').and.callFake(() => {
            component.fetchedArray.push({ _id: 'testId', title: 'testTitle' } as any);
        });

        fixture.detectChanges();
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should update user data when auth service emits', () => {
        const testUser = { username: 'test', role: 'user' } as UserModel;
        authService.loggedInUser$.next(testUser);
        expect(component.loggedInUser).toEqual(testUser);
    });

    it('Should display admin-level content if isAdmin is set to true', () => {
        const expansionItem = fixture.debugElement.query(By.css('[data-test="mat-panel-desc-bookid"]'));
        expect(expansionItem).toBeNull();

        component.currentArrayType = 'books';
        component.isAdmin = true;

        component.changePaginatedArray('books');
        fixture.detectChanges();

        expect(expansionItem).toBeDefined();
    });

    it('Should fetch data properly', fakeAsync(() => {
        component.ngOnInit();
        tick();
        fixture.detectChanges();

        component.changePaginatedArray('books');
        fixture.detectChanges();

        expect(component.changePaginatedArray).toHaveBeenCalledWith('books');
        expect(component.fetchedArray.length).toBe(3);
        expect(component.fetchedArray[0]).toEqual({ _id: 'testId', title: 'testTitle' } as any);
    }));

    it('Should sort the items in the array appropriately', () => {
        component.fetchedArray.push({ _id: '1', title: 'asd' } as any);
        component.fetchedArray.push({ _id: '2', title: 'xyz' } as any);
        fixture.detectChanges();

        component.sortItems({ field: 'id', mode: 'asc' });

        expect(component.currentArrayInPaginator[0]).toEqual({ _id: 'testId', title: 'testTitle' } as any);
        expect(component.currentArrayInPaginator[1]).toEqual({ _id: '1', title: 'asd' } as any);

        component.sortItems({ field: 'title', mode: 'desc' });
        expect(component.currentArrayInPaginator[0]).toEqual({ _id: '2', title: 'xyz' } as any);
        expect(component.currentArrayInPaginator[1]).toEqual({ _id: 'testId', title: 'testTitle' } as any);
    });

    it('Should update currentPageIndey and pageSize on changePage', () => {
        component.maxPages = 3;
        component.currentPageIndex = 1;
        component.pageSize = 5;

        expect(component.currentPageIndex).toEqual(1);
        expect(component.pageSize).toEqual(5);

        component.changePage({ pageIndex: 2, pageSize: 10 });
        expect(component.currentPageIndex).toEqual(2);
        expect(component.pageSize).toEqual(10);
        expect(component.changePaginatedArray).toHaveBeenCalledWith('books');
    });

    it('Should handle HttpErrorResponse errors properly', () => {
        spyOn(component, 'onError').and.callFake((error: HttpErrorResponse) => {
            component.errorMessages.push(error);
        })

        const errorResponse = new HttpErrorResponse({
            error: 'Test error message',
            status: 500,
            statusText: 'Internal Server Error'
        });

        component.onError(errorResponse);

        expect(component.errorMessages.length).toBe(1);
        expect(component.errorMessages[0].error).toEqual('Test error message');
    });

    it('Should delete an item and refresh data', () => {
        const item = { type: 'book' as any, _id: 'testId' };

        component.handleDialogRequest({ dialogType: 'delete', item });

        expect(component.changePaginatedArray).toHaveBeenCalledWith('books');
    });

    it('Should update an item and refresh data', () => {
        const item = { type: 'book' as any, _id: 'testId' };

        component.handleDialogRequest({ dialogType: 'edit', item, modifiedItem: { _id: 'testId', title: 'New' } });

        expect(component.changePaginatedArray).toHaveBeenCalledWith('books');
    });
});
