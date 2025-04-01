import { TestBed } from '@angular/core/testing';
import { TranslationService } from '../../app/services/global/translation.service';
import { TranslateModule } from '@ngx-translate/core';

describe('TranslationService', () => {
    let service: TranslationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports:[
                TranslateModule.forRoot()
            ]
        }).compileComponents();
        service = TestBed.inject(TranslationService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });
});
