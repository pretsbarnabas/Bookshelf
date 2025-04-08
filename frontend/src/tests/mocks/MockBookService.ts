import { of } from "rxjs";

export default class MockBookService {
    getAllBooks = jasmine.createSpy('getAllBooks');
    getBookById = jasmine.createSpy('getBookById');
    getReviewsByBook = jasmine.createSpy('getReviewsByBook');
    Addreview = jasmine.createSpy('Addreview');
    deleteBook = jasmine.createSpy('deleteBook');
    updateBook = jasmine.createSpy('updateBook');
    createBook = jasmine.createSpy().and.returnValue(of({}));
}