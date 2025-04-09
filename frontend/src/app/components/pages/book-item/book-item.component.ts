import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../../services/page/book.service';
import { MatCardModule } from '@angular/material/card';
import { FormlyModule } from '@ngx-formly/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReviewModel } from '../../../models/Review';
import { UserService } from '../../../services/page/user.service';
import { BooklistService } from '../../../services/page/booklist.service';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AuthService } from '../../../services/global/auth.service';
import { UserModel } from '../../../models/User';


@Component({
  selector: 'app-book-item',
  templateUrl: './book-item.component.html',
  styleUrls: ['./book-item.component.scss'],
  imports: [
    FormlyModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormlyMaterialModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatPaginatorModule
  ],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class BookItemComponent implements OnInit {

  public book: any;
  public color: string = 'accent';
  public starCount: number = 5;
  public rating: number = 0;
  bookId: any;
  private snackBarDuration: number = 2000;
  public ratingArr: any = [];
  reviews: ReviewModel[] = [];
  paginatedReviews: ReviewModel[] = [];
  pageSize = 10;
  uniqueIds: any = [];
  uniqueUserIds: any = [];
  users: UserModel[] = [];
  isLoggedIn: boolean = false;
  reviewForm: FormGroup;
  loggedInUser: UserModel | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private booklistService: BooklistService
  ) {
    this.reviewForm = this.fb.group({
      content: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.uniqueIds = [];
    this.bookId = this.route.snapshot.paramMap.get('id');
    this.authService.loggedInUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.loggedInUser = user;
    });
    if (this.bookId) {
      this.bookService.getBookById(this.bookId).subscribe(book => {
        this.book = book;
      });
    }
    if (this.bookId) {
      this.fillreviews();
      console.log(this.uniqueUserIds)

    }
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  addToBooklist(bookId: string | undefined) {
    if (!this.loggedInUser || !bookId) {
      this.snackBar.open('You must be logged in to add books to your booklist.', '', {
        duration: 3000,
      });
      return;
    }

    this.booklistService.updateBookStatus(this.loggedInUser._id, bookId, 'to_read').subscribe({
      next: () => {
        this.snackBar.open('Book added to your booklist!', '', {
          duration: 3000,
        });
      },
      error: (err) => {
        console.error('Error adding book to booklist:', err);
        this.snackBar.open('Failed to add book to your booklist.', '', {
          duration: 3000,
        });
      },
    });
  }

  fillreviews() {
    this.reviews = [];
    this.bookService.getReviewsByBook(this.bookId, this.pageSize).subscribe(reviews => {
      this.reviews = reviews.data;
      console.log(this.reviews)
      for (let i = 0; i < this.reviews.length; i++) {
        if (!this.uniqueUserIds.includes(this.reviews[i].user._id)) {
          this.uniqueUserIds.push(this.reviews[i].user._id);
          console.log(this.uniqueUserIds)
        }
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.fillreviews();
  }

  formatDate(date: any) {
    return this.datePipe.transform(date, 'yyyy');
  }
  onClick(rating: number) {
    // console.log(rating)
    this.snackBar.open('You rated ' + rating + ' / ' + this.starCount, '', {
      duration: this.snackBarDuration
    });
    this.rating = rating;
    return false;
    //  ide  kell még konkretan a  mukodo  rating mentés  ha be  van jelentkezve  a ficko  valamint a rating  kiolvasas akkor is ha  nincs  bejenetkezve
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  showIconUserReview(index: number, Rating: number) {
    if (Rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
  onBack() {
    window.history.back();
  }
  onSubmitReview() {
    console
    if (this.reviewForm.valid) {
      console.log(this.reviewForm.value.content)
      console.log(this.rating)
      console.log(this.bookId)
      const newReview = {
        content: this.reviewForm.value.content,
        score: this.rating * 2,
        book_id: this.bookId,
        user_id: this.loggedInUser!._id
      };
      console.log(newReview)
      if (!this.uniqueUserIds.includes(this.loggedInUser!._id)) {
        this.bookService.Addreview(newReview).subscribe(review => {
          console.log(review)
          this.fillreviews();
          this.reviewForm.reset();
          this.snackBar.open('Review submitted successfully', '', {
            duration: this.snackBarDuration
          });
        });
      }
      else {
        this.snackBar.open('You have already submitted a review', '', {
          duration: this.snackBarDuration
        });
      }
    }
  }
}
export enum StarRatingColor {
  primary = "primary",
  accent = "accent",
  warn = "warn"
}

