import { TestBed } from '@angular/core/testing';
import { FormService } from '../../app/services/page/form.service';
import { TranslationService } from '../../app/services/global/translation.service';
import { TranslateModule } from '@ngx-translate/core';

describe('FormService', () => {
    let service: FormService;
    let translationService: TranslationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
            ]
        }).compileComponents();
        translationService = TestBed.inject(TranslationService);
        service = TestBed.inject(FormService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
