import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CreateComponent } from '../../app/components/pages/create/create.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormService } from '../../app/services/page/form.service';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { of } from 'rxjs';
import { BookService } from '../../app/services/page/book.service';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { TranslationService } from '../../app/services/global/translation.service';
import { SummaryService } from '../../app/services/page/summary.service';
import { FormGroup } from '@angular/forms';
import MockBookService from '../mocks/MockBookService';
import MockSummaryService from '../mocks/MockSummaryService';
import { RouterTestingModule } from '@angular/router/testing';
import { BooksComponent } from '../../app/components/pages/books/books.component';
import { SummariesComponent } from '../../app/components/pages/summaries/summaries.component';

describe('CreateComponent', () => {
    let component: CreateComponent;
    let fixture: ComponentFixture<CreateComponent>;
    let route: ActivatedRoute;
    let router: Router;
    let bookService: MockBookService;
    let translationService: TranslationService;
    let formService: FormService;
    let summaryService: MockSummaryService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CreateComponent,
                TranslateModule.forRoot(),
                RouterTestingModule.withRoutes([
                    { path: 'books', component: BooksComponent },
                    { path: 'summaries', component: SummariesComponent }
                ])
            ],
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { paramMap: { get: () => '/create/book' } },
                        queryParams: of({ id: 'testId' }),
                        url: of([{ path: 'book' }])
                    },
                },
                FormService,
                { provide: BookService, useClass: MockBookService },
                TranslationService,
                { provide: SummaryService, useClass: MockSummaryService },
            ],
        }
        ).compileComponents();

        formService = TestBed.inject(FormService);
        spyOn(formService, 'getCreateFormConfigMapping').and.callThrough();
        route = TestBed.inject(ActivatedRoute);
        router = TestBed.inject(Router);
        bookService = TestBed.inject(BookService) as unknown as MockBookService;
        translationService = TestBed.inject(TranslationService);
        summaryService = TestBed.inject(SummaryService) as unknown as MockSummaryService;

        fixture = TestBed.createComponent(CreateComponent);
        component = fixture.componentInstance;
        component.model = {
            title: '', author: '', release: '', genre: '', description: '', image: ''
        } as any;
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('Should set mode to "book"', fakeAsync(() => {
        component.ngOnInit();
        tick();
        expect(component.mode).toBe('book');
    }));

    it('Should initialize form correctly for book mode', fakeAsync(() => {
        component.mode = 'book';
        component.getForm();
        fixture.detectChanges();
        expect(formService.getCreateFormConfigMapping).toHaveBeenCalled();
    }));

    it('Should initialize form correctly for summary mode', fakeAsync(() => {
        component.mode = 'summary';
        component.getForm();
        fixture.detectChanges();
        expect(formService.getCreateFormConfigMapping).toHaveBeenCalled();
    }));

    it('Should call createBook when form is valid', fakeAsync(() => {
        component.mode = 'book';
        component.model = { title: 'testTitle', author: 'testTitle' };
        component.form = { valid: true } as FormGroup;
        component.onSubmit();
        tick();
        expect(bookService.createBook).toHaveBeenCalledWith(component.model);
    }));

    it('Should call createSummary when form is valid', fakeAsync(() => {
        component.mode = 'summary';
        component.model = { content: 'testContent' };
        component.form = { valid: true } as FormGroup;
        component.onSubmit();
        tick();
        expect(summaryService.createSummary).toHaveBeenCalledWith(component.model);
    }));

    it('Should not submit the form if invalid', fakeAsync(() => {
        component.form = { valid: false } as FormGroup;
        component.onSubmit();
        tick();
        expect(bookService.createBook).not.toHaveBeenCalled();
        expect(summaryService.createSummary).not.toHaveBeenCalled();
    }));
    
    it('Should navigate to books on book creation', fakeAsync(() => {
        spyOn(router, 'navigate').and.callThrough();
        component.mode = 'book';
        component.model = { title: 'testTitle', author: 'testTitle' };
        component.form = { valid: true } as FormGroup;
        component.onSubmit();
        tick();
        expect(router.navigate).toHaveBeenCalledWith(['books']);
    }));

    it('Should navigate to summaries on summary creation', fakeAsync(() => {        
        spyOn(router, 'navigate').and.callThrough();
        component.mode = 'summary';
        component.model = { content: 'testContent' };
        component.form = { valid: true } as FormGroup;
        component.onSubmit();
        tick();
        expect(router.navigate).toHaveBeenCalledWith(['summaries']);
    }));
});