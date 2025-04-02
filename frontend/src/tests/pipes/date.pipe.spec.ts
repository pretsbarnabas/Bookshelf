import { DatePipe, registerLocaleData } from "@angular/common";
import { LocalizedDatePipe } from "../../app/pipes/date.pipe";
import { ChangeDetectorRef, LOCALE_ID } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import localeHu from '@angular/common/locales/hu';
import { TranslationService } from "../../app/services/global/translation.service";
import { BehaviorSubject } from "rxjs";

describe('DatePipe', () => {
    let pipe: LocalizedDatePipe;
    let cdRef: jasmine.SpyObj<ChangeDetectorRef>
    let languageSubject: BehaviorSubject<string>;
    let mockTranslationService: jasmine.SpyObj<TranslationService>;

    beforeEach(async () => {   
        registerLocaleData(localeHu)         
        cdRef = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck']);
        languageSubject = new BehaviorSubject<string>('en');

        mockTranslationService = jasmine.createSpyObj('TranslationService', [], {
            currentLanguage$: languageSubject.asObservable(),
        });
        
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
            ],
            providers: [
                DatePipe,
                { provide: LOCALE_ID, useValue: 'en-US' },
                ChangeDetectorRef,
                { provide: ChangeDetectorRef, useValue: cdRef },
                { provide: TranslationService, useValue: mockTranslationService },
                LocalizedDatePipe,                
            ]
        });        
        pipe = TestBed.inject(LocalizedDatePipe);
    })

    it('Create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('Should format a date to english locale', () => {
        expect(pipe.transform('2025-04-01')).toBe('April 1, 2025');
    });

    it('Should format a date to hungarian locale', () => {   
        languageSubject.next('hu'); 
        expect(pipe.transform('2025-04-01')).toBe('2025. április 1.');
    });
});
