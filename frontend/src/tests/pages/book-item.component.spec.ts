import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookItemComponent } from '../../app/components/pages/book-item/book-item.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideConfig } from '../../app/services/global/config.service';
import { TranslateModule } from '@ngx-translate/core';
import { CrudService } from '../../app/services/global/crud.service';

describe('BookItemComponent', () => {
    let component: BookItemComponent;
    let fixture: ComponentFixture<BookItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                BookItemComponent,
                TranslateModule.forRoot()
            ],
            providers: [
                provideHttpClient(),
                provideConfig(['apiurl', 'https://testing.com']),
                CrudService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { paramMap: { get: () => '/book-item' } },
                        queryParams: of({ test: 'testValue' }),
                    },
                },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(BookItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });
});
