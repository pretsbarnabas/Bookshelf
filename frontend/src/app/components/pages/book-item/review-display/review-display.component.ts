import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { ReviewModel } from '../../../../models/Review';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RelativeTimePipe } from '../../../../pipes/relative-time.pipe';
import { AuthService } from '../../../../services/global/auth.service';
import { UserModel } from '../../../../models/User';
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
    @Input() review?: ReviewModel;

    reviewLikedBy: UserModel[] = [];
    reviewDislikedBy: UserModel[] = [];
    userLikedAction: 'like' | 'dislike' | 'none' = 'none';

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
                this.reviewLikedBy = result;
                if (result.some((user: any) => user._id === this.user?._id))
                    this.userLikedAction = 'like';
            }
        });
        this.reviewService.getDislikedBy(this.review?._id!).subscribe({
            next: (result) => {
                this.reviewDislikedBy = result;
                if (result.some((user: any) => user._id === this.user?._id))
                    this.userLikedAction = 'dislike';
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

    handleLikeRequest(action: 'like' | 'dislike' | 'none') {
        switch (action) {
            case 'like':
                if (this.userLikedAction === 'like') {                    
                    this.reviewService.putLike(this.review?._id!, 'delete').subscribe({
                        next: (result) => {
                            this.userLikedAction = 'none';
                            this.reviewLikedBy = this.reviewLikedBy.filter((user) => user._id !== this.user!._id);
                        }
                    });
                    return;
                }                
                this.reviewService.putLike(this.review?._id!, 'like').subscribe({
                    next: (result) => {
                        this.userLikedAction = 'like';                        
                        this.reviewDislikedBy = this.reviewDislikedBy.filter((user) => user._id !== this.user!._id);
                        this.reviewLikedBy.push(this.user!);
                    }
                });
                break;
            case 'dislike':
                if (this.userLikedAction === 'dislike') {
                    this.reviewService.putLike(this.review?._id!, 'delete').subscribe({
                        next: (result) => {
                            this.userLikedAction = 'none';
                            this.reviewDislikedBy = this.reviewDislikedBy.filter((user) => user._id !== this.user!._id);
                        }
                    });
                    return;
                }                
                this.reviewService.putLike(this.review?._id!, 'dislike').subscribe({
                    next: (result) => {
                        this.userLikedAction = 'dislike';
                        this.reviewLikedBy = this.reviewLikedBy.filter((user) => user._id !== this.user!._id);
                        this.reviewDislikedBy.push(this.user!);
                    }
                });
                break;
        }
    }
}
