import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { TranslationService } from '../services/translation.service';

@Pipe({
    name: 'localizedDate',
    standalone: true,
    pure: false
})
export class LocalizedDatePipe implements PipeTransform, OnDestroy {
    private currentLang = 'en';
    private langSubscription: Subscription;

    constructor(
        private datePipe: DatePipe,
        private translationService: TranslationService,
        private cd: ChangeDetectorRef
    ) {
        this.langSubscription = this.translationService.currentLanguage$.subscribe(lang => {
            this.currentLang = lang;
            this.cd.markForCheck();
        });
    }

    transform(value: Date | string | number, format: string = 'longDate'): string | null {
        if (!value) return null;
        return this.datePipe.transform(value, format, undefined, this.currentLang);
    }

    ngOnDestroy(): void {
        this.langSubscription?.unsubscribe();
    }
}
