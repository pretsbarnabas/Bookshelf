import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllTypeDisplayComponent } from '../../app/utilities/components/all-type-display/all-type-display.component';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../app/services/global/auth.service';
import { UserService } from '../../app/services/page/user.service';
import { BookService } from '../../app/services/page/book.service';
import { ReviewService } from '../../app/services/page/review.service';
import { SummaryService } from '../../app/services/page/summary.service';
import { CommentService } from '../../app/services/page/comment.service';
import { TranslationService } from '../../app/services/global/translation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import MockAuthService from '../mocks/MockAuthService';
import MockUserService from '../mocks/MockUserService';
import MockBookService from '../mocks/MockBookService';
import MockReviewService from '../mocks/MockReviewService';
import MockSummaryService from '../mocks/MockSummaryService';
import MockCommentService from '../mocks/MockCommentService';
import { UserModel } from '../../app/models/User';

describe('AllTypeDisplayComponent', () => {
    let authService: MockAuthService;
    let userService: MockUserService;
    let bookService: MockBookService;
    let reviewService: MockReviewService;
    let summaryService: MockSummaryService;
    let commentService: MockCommentService;
    // let translationService: TranslationService;
    // let snackBar: MatSnackBar;
    let component: AllTypeDisplayComponent;
    let fixture: ComponentFixture<AllTypeDisplayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AllTypeDisplayComponent,
                BrowserAnimationsModule,
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
        component.changePaginatedArray = jasmine.createSpy('changePaginatedArray');


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
});
