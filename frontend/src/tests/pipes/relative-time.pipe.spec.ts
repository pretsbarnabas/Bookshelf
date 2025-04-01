import { registerLocaleData } from "@angular/common";
import { RelativeTimePipe } from "../../app/pipes/relative-time.pipe";
import { ChangeDetectorRef, LOCALE_ID } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TranslationService } from "../../app/services/global/translation.service";
import { TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import localeHu from '@angular/common/locales/hu';

describe('RelativeTimePipe', () => {
    let pipe: RelativeTimePipe;
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
                { provide: LOCALE_ID, useValue: 'en-US' },
                ChangeDetectorRef,
                { provide: ChangeDetectorRef, useValue: cdRef },
                { provide: TranslationService, useValue: mockTranslationService },
                RelativeTimePipe,
            ]
        });
        pipe = TestBed.inject(RelativeTimePipe);
    });

    it('Create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('Should format the date to relative time, using english locale', () => {
        let testTimeNow = new Date('2025-04-01T12:00:00Z');
        expect(pipe.transform('2025-04-01T00:00:00Z', testTimeNow)).toBe('12 hours ago');

        testTimeNow = new Date('2025-04-01T00:15:00Z');
        expect(pipe.transform('2025-04-01T00:00:00Z', testTimeNow)).toBe('15 minutes ago');

        testTimeNow = new Date('2025-04-10T00:00:00Z');
        expect(pipe.transform('2025-04-01T00:00:00Z', testTimeNow)).toBe('last week');

        testTimeNow = new Date('2028-04-10T00:00:00Z');
        expect(pipe.transform('2025-04-01T00:00:00Z', testTimeNow)).toBe('3 years ago');
    });

    it('Should format the date to relative time, using hungarian locale', () => {
        languageSubject.next('hu');

        let testTimeNow = new Date('2025-04-01T12:00:00Z');
        expect(pipe.transform('2025-04-01T00:00:00Z', testTimeNow)).toBe('12 órával ezelőtt');

        testTimeNow = new Date('2025-04-01T00:15:00Z');
        expect(pipe.transform('2025-04-01T00:00:00Z', testTimeNow)).toBe('15 perccel ezelőtt');

        testTimeNow = new Date('2025-04-10T00:00:00Z');
        expect(pipe.transform('2025-04-01T00:00:00Z', testTimeNow)).toBe('előző hét');

        testTimeNow = new Date('2028-04-10T00:00:00Z');
        expect(pipe.transform('2025-04-01T00:00:00Z', testTimeNow)).toBe('3 évvel ezelőtt');
    });
});
