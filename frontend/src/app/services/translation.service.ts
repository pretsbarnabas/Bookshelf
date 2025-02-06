import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<string>('Initial Value');
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(public service: TranslateService) {
    service.addLangs(['en', 'hu']);
    service.setDefaultLang('en');
    service.use('en')
  }

  changeLanguage(key: string) {
    this.service.use(key);
    this.currentLanguageSubject.next(key);  // Notify all subscribers of the new value
  }
}
