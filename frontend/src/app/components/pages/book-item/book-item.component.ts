import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { MatCardModule } from '@angular/material/card';
import { FormlyModule } from '@ngx-formly/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Review } from '../../../models/Review';
import { UserLoggedInModel } from '../../../models/User';
import { UserService } from '../../../services/user.service';

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
  ],
  providers: [DatePipe]
})
export class BookItemComponent implements OnInit {

  public book: any;
  public color: string = 'accent';
  public starCount: number = 5;
  public rating: number = 3;
  bookId: any;
  private snackBarDuration: number = 2000;
  public ratingArr: any = [];
  reviews: Review[] = [];
  uniqueIds: any = [];
  users: UserLoggedInModel[] = [];
  constructor(private route: ActivatedRoute, private bookService: BookService, private datePipe: DatePipe, private snackBar: MatSnackBar, private userService: UserService){}
  
  ngOnInit(){
    this.uniqueIds = [];
    this.bookId = this.route.snapshot.paramMap.get('id');
    if (this.bookId) {
        this.bookService.getBookById(this.bookId).subscribe(book => {
          this.book = book;
        });
      }
      if (this.bookId) {
        this.bookService.getReviewsByBook(this.bookId).subscribe(reviews => {
          this.reviews = reviews;
          });
      }
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }
  
  formatDate(date: any) {
    return this.datePipe.transform(date, 'yyyy');
  }
  onClick(rating:number) {
    // console.log(rating)
    this.snackBar.open('You rated ' + rating + ' / ' + this.starCount, '', {
      duration: this.snackBarDuration
    });
    this.rating = rating;
    return false;
    //  ide  kell még konkretan a  mukodo  rating mentés  ha be  van jelentkezve  a ficko  valamint a rating  kiolvasas akkor is ha  nincs  bejenetkezve
  }
  
  showIcon(index:number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
  
  showIconUserReview(index:number, Rating:number) {
    if (Rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
  onBack() {
      window.history.back();
  }
  
}
export enum StarRatingColor {
  primary = "primary",
  accent = "accent",
  warn = "warn"
}

