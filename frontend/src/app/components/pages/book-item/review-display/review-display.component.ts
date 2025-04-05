import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { ReviewModel } from '../../../../models/Review';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RelativeTimePipe } from '../../../../pipes/relative-time.pipe';
import { AuthService } from '../../../../services/global/auth.service';
import { UserLikeModel, UserModel } from '../../../../models/User';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslatePipe } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../../../services/page/comment.service';
import { CommentModel } from '../../../../models/Comment';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReviewService } from '../../../../services/page/review.service';
import { MatDialog } from '@angular/material/dialog';
import { DisplayLikesDialogComponent } from './display-likes-dialog/display-likes-dialog.component';

@Component({
    selector: 'review-display',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        RelativeTimePipe,
        TranslatePipe,
        MatCardModule,
        FlexLayoutModule
    ],
    templateUrl: './review-display.component.html',
    styleUrl: './review-display.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class ReviewDisplayComponent {
    private authService = inject(AuthService);
    private reviewService = inject(ReviewService);
    private commentService = inject(CommentService);
    private fb = inject(FormBuilder);
    readonly dialog = inject(MatDialog);
    @Input() review?: ReviewModel;

    user?: UserModel | null
    ratingArr: number[] = [0, 1, 2, 3, 4]

    comments: CommentModel[] = [];
    maxCommentPages: number = 0;
    commentSampleSize: number = 5;
    isCommenting: boolean = false;
    commentUnderEdit: CommentModel | null = null;

    commentForm?: FormGroup;
    commentEditForm?: FormGroup;
    showComments: boolean = false;

    ngOnChanges() {
        this.review!.likedBy = [];
        this.review!.dislikedBy = [];
        this.getComments();
        this.getReviewLikes();
        this.authService.loggedInUser$.subscribe((user) => {
            this.user = user;
        })
        this.commentForm = this.fb.group({
            comment: [''/*, Validators.required*/]
        });
        this.commentEditForm = this.fb.group({
            comment: ['', Validators.required]
        });
    }

    getComments() {
        this.commentService.getAllcomments(this.commentSampleSize, 0, undefined, /*this.review?._id*/).subscribe({
            next: (result) => {
                this.comments = result.data;
                this.comments.forEach((comment) => {
                    comment.likedBy = [];
                    comment.dislikedBy = [];
                    this.commentService.getLikedBy(comment._id).subscribe({
                        next: (result) => {
                            comment.likedBy = result;
                            if (result.some((user: any) => user._id === this.user?._id))
                                comment.liked_by_user = 'liked';
                        }
                    });
                    this.commentService.getDislikedBy(comment._id).subscribe({
                        next: (result) => {
                            comment.dislikedBy = result;
                            if (result.some((user: any) => user._id === this.user?._id))
                                comment.liked_by_user = 'disliked';
                        }
                    });
                });
                this.maxCommentPages = result.pages;
            },
            error: (err) => {
                console.log(err);
            },
        })
    }

    getReviewLikes() {
        this.reviewService.getLikedBy(this.review?._id!).subscribe({
            next: (result) => {
                this.review!.likedBy = result;
                if (result.some((user: any) => user._id === this.user?._id))
                    this.review!.liked_by_user = 'liked';
            }
        });
        this.reviewService.getDislikedBy(this.review?._id!).subscribe({
            next: (result) => {
                this.review!.dislikedBy = result;
                if (result.some((user: any) => user._id === this.user?._id))
                    this.review!.liked_by_user = 'disliked';
            }
        });
    }

    loadCommentsBySampleSize(_sample: number) {
        this.commentSampleSize += _sample;
        this.getComments();
    }


    showIconUserReview(index: number, Rating: number) {
        if (Rating >= index + 1) {
            return 'star';
        } else {
            return 'star_border';
        }
    }

    clearComment(): void {
        this.commentForm?.controls!['comment'].setValue('');
        this.isCommenting = false;
    }

    submitComment() {
        if (this.commentForm?.valid) {
            this.commentService.createComment(
                { review_id: this.review?._id!, content: this.commentForm.controls['comment'].value }
            ).subscribe({
                next: (result) => {
                    this.clearComment();
                    setTimeout(() => {
                        this.getComments();
                    }, 1000);
                },
                error: (err) => {
                    console.log(err);
                },
            })
        }
    }

    deleteComment($event: CommentModel) {
        if (this.comments.length % 5 === 1 && this.comments.length > 5)
            this.commentSampleSize -= 5;
        if (this.user?._id === $event.user._id) {
            this.commentService.deleteComment($event._id).subscribe({
                next: (result) => {
                    this.getComments();
                },
                error: (err) => {
                    console.log(err);
                },
            })
        }
    }

    editComment($event: CommentModel) {
        this.commentUnderEdit = structuredClone($event);
        this.commentEditForm!.controls['comment'].setValue(this.commentUnderEdit.content);
    }

    cancelEditComment() {
        this.commentEditForm!.controls['comment'].setValue('');
        this.commentUnderEdit = null
    }

    submitEditComment($event: CommentModel) {
        if (this.commentEditForm?.valid) {
            this.commentService.updateComment($event._id, { ...$event, content: this.commentEditForm.controls['comment'].value }).subscribe({
                next: (result) => {
                    this.cancelEditComment();
                    setTimeout(() => {
                        this.getComments();
                    }, 1000);
                },
                error: (err) => {
                    console.log(err);
                },
            })
        }
    }

    handleLikeRequest(_item: ReviewModel | CommentModel, _action: 'like' | 'dislike' | 'none') {
        const serviceMap = new Map<string, ReviewService | CommentService>([
            ['review', this.reviewService],
            ['comment', this.commentService],
        ]);

        const isReview = 'book' in _item;
        const typeKey = isReview ? 'review' : 'comment';
        const service = serviceMap.get(typeKey)!;

        const userId = this.user!._id;

        const updateState = (state: 'liked' | 'disliked' | 'none') => {
            _item.liked_by_user = state;

            if (state === 'liked') {
                _item.dislikedBy = _item.dislikedBy?.filter((u) => u._id !== userId) || [];
                _item.likedBy = [...(_item.likedBy || []), this.user as UserLikeModel];
            } else if (state === 'disliked') {
                _item.likedBy = _item.likedBy?.filter((u) => u._id !== userId) || [];
                _item.dislikedBy = [...(_item.dislikedBy || []), this.user as UserLikeModel];
            } else {
                _item.likedBy = _item.likedBy?.filter((u) => u._id !== userId) || [];
                _item.dislikedBy = _item.dislikedBy?.filter((u) => u._id !== userId) || [];
            }
        };

        const toggleState = (newState: 'liked' | 'disliked') => {
            if (_item.liked_by_user === newState) {
                service.putLike(_item._id, 'delete').subscribe(() => updateState('none'));
            } else {
                service.putLike(_item._id, newState.slice(0, newState.length - 1) as 'like' | 'dislike').subscribe(() => updateState(newState));
            }
        };

        switch (_action) {
            case 'like':
                toggleState('liked');
                break;
            case 'dislike':
                toggleState('disliked');
                break;
            default:
                service.putLike(_item._id, 'delete').subscribe(() => updateState('none'));
                break;
        }
    }

    showLikesOrDislikes(_likes: UserLikeModel[], _dilikes: UserLikeModel[]) {
        if (_likes.length > 0) {
            const dialogRef = this.dialog.open(DisplayLikesDialogComponent, {
                data: {
                    likes: _likes,
                    dislikes: _dilikes,
                }
            });
        }
    }
}
