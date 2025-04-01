import { Book } from './Book';

export interface BookList {
  id: string;
  userId: string;
  books: Book[];
}