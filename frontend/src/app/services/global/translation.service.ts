import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    public service = inject(TranslateService);
    private currentLanguageSubject = new BehaviorSubject<string>('Initial Value');
    currentLanguage$ = this.currentLanguageSubject.asObservable();
    private supportedLanguages: string[] = ['en', 'hu'];

    constructor() {
        this.service.addLangs(this.supportedLanguages);
        this.service.setDefaultLang('en');
    }

    checkPreferred(): string {
        const localLang: string | null = localStorage.getItem('preferredLang');
        const browserLang: string = navigator.language.split('-')[0];
        if (localLang && this.supportedLanguages.includes(localLang)) {
            this.changeLanguage(localLang);
            return localLang;
        }
        else if (this.supportedLanguages.includes(browserLang)) {
            localStorage.setItem('preferredLang', browserLang);
            this.changeLanguage(browserLang);
            return browserLang;
        } else
            this.service.use('en');
        return 'en';

    }

    changeLanguage(key: string) {
        this.service.use(key);
        localStorage.setItem('preferredLang', key);
        this.currentLanguageSubject.next(key);
    }
}
