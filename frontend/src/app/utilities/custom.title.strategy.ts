import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslationService } from '../services/global/translation.service';

@Injectable({ providedIn: 'root' })
export class CustomTitleStrategy extends TitleStrategy {

    private injector: Injector;

    constructor(
        private title: Title,
        injector: Injector
    ) {
        super();
        this.injector = injector;
    }

    override updateTitle(state: RouterStateSnapshot): void {
        const routeTitle = this.buildTitle(state);
        if (!routeTitle) return;

        runInInjectionContext(this.injector, () => {
            const translationService = inject(TranslationService);
            translationService.currentLanguage$.subscribe(lang => {
                translationService.service.get(routeTitle).subscribe((translatedTitle: string) => {
                    this.title.setTitle(translatedTitle);
                });
            })
        });
    }
}
