import { TestBed } from '@angular/core/testing';
import { TranslationService } from '../../app/services/global/translation.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

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

    it('Should get preferredLang from localStorage', ()=>{
        spyOn(localStorage, 'getItem').and.returnValue('hu');
        expect(service.checkPreferred()).toEqual('hu');
    });

    it('Should get preferredLang from browser head', ()=>{
        spyOn(localStorage, 'getItem').and.returnValue(null);
        spyOnProperty(window.navigator, 'language').and.returnValue('en');
        expect(service.checkPreferred()).toEqual('en');
    });

    it('Should return en as default', ()=>{
        spyOn(localStorage, 'getItem').and.returnValue(null);
        spyOnProperty(window.navigator, 'language').and.returnValue('de');
        expect(service.checkPreferred()).toEqual('en');
    });

    it('Should change language', ()=>{
        spyOn(TranslateService.prototype, 'use').and.callThrough();
        spyOn(localStorage, 'setItem').and.callThrough();

        service.changeLanguage('hu');
        expect(TranslateService.prototype.use).toHaveBeenCalledWith('hu');
        expect(localStorage.setItem).toHaveBeenCalledWith('preferredLang', 'hu');

        service.currentLanguage$.subscribe((lang) => {
            expect(lang).toEqual('hu');
        });
    });
});
