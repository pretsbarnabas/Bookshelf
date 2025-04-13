import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BooksComponent } from '../../app/components/pages/books/books.component';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { TranslateModule } from '@ngx-translate/core';
import { CrudService } from '../../app/services/global/crud.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { BookDisplayComponent } from '../../app/utilities/components/book-display/book-display.component';

describe('BooksComponent', () => {
    let component: BooksComponent;
    let fixture: ComponentFixture<BooksComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                BooksComponent,
                TranslateModule.forRoot()
            ],
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { paramMap: { get: () => '/summary-item' } },
                        queryParams: of({ test: 'testValue' }),
                    },
                },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(BooksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('Should have called book-display component in the html', ()=>{        
        expect(fixture.nativeElement.querySelector('book-display')).toBeDefined();
        
        const childComponent = fixture.debugElement.query(By.directive(BookDisplayComponent)).componentInstance;
        expect(childComponent.mode).toEqual('books');
    })
});
