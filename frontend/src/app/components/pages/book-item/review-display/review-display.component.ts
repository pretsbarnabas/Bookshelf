import { Component, inject, Input, OnChanges, ViewEncapsulation } from '@angular/core';
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
    private commentService = inject(CommentService);
    private fb = inject(FormBuilder);
    @Input() review?: ReviewModel;

    user?: UserModel | null
    ratingArr: number[] = [0, 1, 2, 3, 4]

    comments: CommentModel[] = [];
    maxCommentPages: number = 0;
    currentCommentIndex: number = 0;
    commentSampleSize: number = 5;
    commentContent: string = '';
    commentForm?: FormGroup;
    showComments: boolean = false;

    ngOnChanges() {
        this.authService.loggedInUser$.subscribe((user) => {
            this.user = user;
        })
        this.getComments();
        this.commentForm = this.fb.group({
            comment: [''/*, Validators.required*/]
        });
    }

    getComments() {
        this.commentService.getAllcomments(this.commentSampleSize, 0, undefined, this.review?._id).subscribe({
            next: (result) => {
                console.log(result, this.currentCommentIndex);                
                this.comments = result.data;
                if(result.data.length < 5){
                    this.commentSampleSize = result.data.length
                    this.currentCommentIndex = 1;
                }
                this.maxCommentPages = result.pages;
            },
            error: (err) => {
                console.log(err);
            },
        })
    }

    loadCommentsBySampleSize(_sample: number) {
        this.commentSampleSize += _sample;        
        _sample > 0 ? this.currentCommentIndex++ : this.currentCommentIndex--;
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
        this.commentForm?.controls!['comment'].setValue('')
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
                    }, 800);
                },
                error: (err) => {
                    console.log(err);
                },
            })
        }
    }
}
