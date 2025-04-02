import { TestBed } from '@angular/core/testing';
import { BookService } from '../../app/services/page/book.service';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { CrudService } from '../../app/services/global/crud.service';
import { BookModel, BookRoot } from '../../app/models/Book';
import { of } from 'rxjs';

describe('BookService', () => {
    let service: BookService;
    let crudService: CrudService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService
            ],
        }).compileComponents();
        crudService = TestBed.inject(CrudService);
        service = TestBed.inject(BookService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
        expect(service['crudService']).toBeDefined();
    });

    it('Should call crudService.getAll', () => {
        const pageSize = 10;
        const pageIndex = 1;
        const response: BookRoot = { data: [], pages: 0 };
        spyOn(crudService, 'getAll').and.returnValue(of(response));

        service.getAllBooks(pageSize, pageIndex).subscribe(response => {
            expect(crudService.getAll).toHaveBeenCalledWith(`books?limit=${pageSize}&page=${pageIndex}`);
            expect(response).toEqual(response);
        });
    });

    it('Should call crudService.delete', () => {
        const bookId = 'testId';
        spyOn(crudService, 'delete').and.returnValue(of({}));

        service.deleteBook(bookId).subscribe(response => {
            expect(crudService.delete).toHaveBeenCalledWith('books', bookId);
            expect(response).toEqual({});
        });
    });

    it('Should call crudService.update', () => {
        const modifiedBook: BookModel = { _id: 'testId', title: 'testTitle' } as BookModel;
        spyOn(crudService, 'update').and.returnValue(of({}));
        service.updateBook(modifiedBook._id, modifiedBook).subscribe(response => {
            expect(crudService.update).toHaveBeenCalledWith('books', modifiedBook._id, modifiedBook);
            expect(response).toEqual({});
        });
    });
});
