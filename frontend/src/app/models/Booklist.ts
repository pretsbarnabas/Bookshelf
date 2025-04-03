import { BookModel } from './Book';

export interface BookList {
  book: BookModel;
  read_status: string;
}