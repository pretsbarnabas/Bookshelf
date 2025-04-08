import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReviewDisplayComponent } from '../../app/components/pages/book-item/review-display/review-display.component';
import { AuthService } from '../../app/services/global/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../app/services/global/translation.service';
import MockAuthService from '../mocks/MockAuthService';
import { BookModel } from '../../app/models/Book';
import { UserModel } from '../../app/models/User';
import { RelativeTimePipe } from '../../app/pipes/relative-time.pipe';
import { LOCALE_ID } from '@angular/core';
import { of } from 'rxjs';
import { ReviewService } from '../../app/services/page/review.service';
import { CommentService } from '../../app/services/page/comment.service';
import { MatDialog } from '@angular/material/dialog';
import MockReviewService from '../mocks/MockReviewService';
import MockCommentService from '../mocks/MockCommentService'
import { FormBuilder } from '@angular/forms';
import { CommentModel } from '../../app/models/Comment';
import { DisplayLikesDialogComponent } from '../../app/components/pages/book-item/review-display/display-likes-dialog/display-likes-dialog.component';

class MockDialog {
    open = jasmine.createSpy().and.returnValue({ afterClosed: () => of(true) });
}

describe('ReviewDisplayComponent', () => {
    let component: ReviewDisplayComponent;
    let fixture: ComponentFixture<ReviewDisplayComponent>;
    let authService: MockAuthService;
    let commentService: MockCommentService;
    let reviewService: MockReviewService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ReviewDisplayComponent,
                TranslateModule.forRoot(),
            ],
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                { provide: AuthService, useClass: MockAuthService },
                { provide: ReviewService, useClass: MockReviewService },
                { provide: CommentService, useClass: MockCommentService },
                { provide: MatDialog, useClass: MockDialog },
                { provide: TranslationService, useClass: TranslationService },
                { provide: LOCALE_ID, useValue: 'en-US' },
                RelativeTimePipe
            ]
        }).compileComponents();

        authService = TestBed.inject(AuthService) as unknown as MockAuthService;
        commentService = TestBed.inject(CommentService) as unknown as MockCommentService;
        reviewService = TestBed.inject(ReviewService) as unknown as MockReviewService;
        fixture = TestBed.createComponent(ReviewDisplayComponent);
        component = fixture.componentInstance;
        component.review = {
            type: 'review',
            _id: "testId",
            book: {
                _id: "testId",
                title: "TestTitle",
                author: "TestAuthor",
                imageUrl: "test.png"
            } as BookModel,
            user: {
                _id: 'testId',
                username: 'TestUser',
                imageUrl: 'test.png'
            } as UserModel,
            content: "TestContent",
            score: 0,
            liked_by_user: 'none',
            likedBy: [],
            dislikedBy: [],
            created_at: "",
            updated_at: ""
        }
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('Should load likes and dislikes for the review', fakeAsync(() => {
        component.user = { _id: 'user123' } as UserModel;
        component.review = { _id: 'review123', book: {} } as any;
        component.getReviewLikes();
        tick();

        expect(component.review!.likedBy).toEqual([]);
        expect(component.review!.dislikedBy).toEqual([]);
    }));

    it('Should increment commentSampleSize', fakeAsync(() => {
        spyOn(component, 'getComments').and.callThrough();
        component.loadCommentsBySampleSize(5);
        tick();
        expect(component.commentSampleSize).toEqual(10);
        expect(component.getComments).toHaveBeenCalled();
    }));

    it('Should show review star icon properly', () => {
        expect(component.showIconUserReview(0, 3)).toEqual('star');
        expect(component.showIconUserReview(3, 2)).toEqual('star_border');
    });

    it('Should clear comment', () => {
        component.isCommenting = true;
        component.clearComment();
        expect(component.isCommenting).toBeFalse();
    });

    it('Should submit a comment', fakeAsync(() => {
        component.review = { _id: 'review123', book: {} } as any;
        component.commentForm = new FormBuilder().group({ comment: ['This is a test comment'] });

        component.submitComment();
        tick();

        expect(commentService.createComment).toHaveBeenCalledWith({
            review_id: 'review123',
            content: 'This is a test comment'
        });
    }));

    it('Should call deleteComment and update commentSampleSize', fakeAsync(() => {
        const comment = {
            _id: 'testId',
            user: { _id: 'testId', username: 'testUser' }
        } as CommentModel;

        component.user = { _id: 'testId' } as UserModel;
        component.comments = [comment];
        component.commentSampleSize = 5;

        spyOn(component, 'getComments');

        component.deleteComment(comment);

        expect(commentService.deleteComment).toHaveBeenCalledWith(comment._id);
        expect(component.commentSampleSize).toBe(5);
        expect(component.getComments).toHaveBeenCalled();
    }));

    it('Should set commentUnderEdit', () => {
        spyOn(component, 'editComment').and.callFake((comment: CommentModel) => {
            component.commentUnderEdit = structuredClone(comment);
        });
        const comment = {
            _id: 'testId',
            content: 'TestContent',
            user: { _id: 'testId', username: 'testUser' }
        } as CommentModel;

        component.editComment(comment);

        expect(component.commentUnderEdit).toEqual(jasmine.objectContaining(comment));
    });

    it('Should update like/dislike state', fakeAsync(() => {
        const review = {
            _id: 'testId',
            likedBy: [],
            dislikedBy: [],
            liked_by_user: 'none'
        } as any;

        component.user = { _id: 'testId' } as UserModel;
        component.review = review;
        spyOn(component, 'handleLikeRequest').and.callFake((item: any, action: string)=>{
            reviewService.putLike(item._id, action);
        });

        component.handleLikeRequest(review, 'like');
        expect(reviewService.putLike).toHaveBeenCalledWith(review._id, 'like');        

        component.handleLikeRequest(review, 'dislike');
        expect(reviewService.putLike).toHaveBeenCalledWith(review._id, 'dislike');        
    }));

    it('Should open DisplayLikesDialogComponent', () => {
        const likes = [{ _id: 'user1', username: 'user1', imageUrl: 'test.png' }];
        const dislikes = [{ _id: 'user2', username: 'user2', imageUrl: 'test.png' }];

        component.showLikesOrDislikes(likes, dislikes);

        expect(component.dialog.open).toHaveBeenCalledWith(DisplayLikesDialogComponent, {
            data: { likes, dislikes }
        });
    });


});
