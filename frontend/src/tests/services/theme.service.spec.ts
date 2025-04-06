import { TestBed } from '@angular/core/testing';
import { ThemeService } from '../../app/services/global/theme.service';

describe('ThemeService', () => {
    let service: ThemeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ThemeService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });

    // it('Should get preferredTheme from sessionStorage', () => {
    //     spyOn(localStorage, 'getItem').and.returnValue('light');
    //     expect(service.checkPreferredTheme()).toEqual('light');
    // });

    it('Should get isEyeSaveModeOn from sessionStorage', () => {        
        spyOn(service, 'changeEyeSaveMode').and.callFake(()=>{});
        spyOn(sessionStorage, 'getItem').and.returnValue('true');
        expect(service.checkEyeSaverMode()).toBeTrue();
    });

    it('Should get colorBlindnessMode from localStorage', () => {
        spyOn(service, 'changeColorBlindnessMode').and.callFake(()=>{});
        spyOn(localStorage, 'getItem').and.returnValue('monochrome');
        expect(service.checkColorBlindnessMode()).toEqual('monochrome');
    });
    
});
