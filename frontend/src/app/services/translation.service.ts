import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    private currentLanguageSubject = new BehaviorSubject<string>('Initial Value');
    currentLanguage$ = this.currentLanguageSubject.asObservable();
    private supportedLanguages: string[] = ['en', 'hu'];

    constructor(
        public service: TranslateService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        if (isPlatformBrowser(this.platformId)) {
            service.addLangs(this.supportedLanguages);
            service.setDefaultLang('en');
            service.use('en').subscribe();
        }
    }

    checkPreferred(): string {
        if (isPlatformBrowser(this.platformId)) {
            let localLang: string | null = localStorage.getItem('preferredLang');
            const browserLang: string = typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en';

            if (localLang && this.supportedLanguages.includes(localLang)) {
                this.changeLanguage(localLang);
                return localLang;
            } else if (this.supportedLanguages.includes(browserLang)) {
                localStorage.setItem('preferredLang', browserLang);
                this.changeLanguage(browserLang);
                return browserLang;
            } else {
                this.service.use('en');
                return 'en';
            }
        }
        return 'en';
    }


    changeLanguage(key: string) {
        if (isPlatformBrowser(this.platformId)) {
            this.service.use(key);
            localStorage.setItem('preferredLang', key);
            this.currentLanguageSubject.next(key);
        }
    }
}
