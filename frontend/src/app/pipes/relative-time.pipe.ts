import { ChangeDetectorRef, inject, Pipe, PipeTransform } from "@angular/core";
import { TranslationService } from "../services/global/translation.service";
import { Subscription } from "rxjs";

@Pipe({
    name: 'relativeTime',
    standalone: true,
    pure: false
})
export class RelativeTimePipe implements PipeTransform {
    private translationService = inject(TranslationService,);
    private cd = inject(ChangeDetectorRef);

    private currentLang: string = 'en'
    private langSubscription: Subscription;

    constructor() {
        this.langSubscription = this.translationService.currentLanguage$.subscribe(lang => {
            this.currentLang = lang;
            this.cd.markForCheck();
        });
    }

    transform(value: Date | string | number, dateNow?: Date): string {
        if (!value) return '';

        const date = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;
        const now = dateNow ?? new Date();
        const diffInSeconds = Math.round((date.getTime() - now.getTime()) / 1000);

        const formatter = new Intl.RelativeTimeFormat(this.currentLang, { numeric: 'auto' });

        const timeIntervals: { [key: string]: number } = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };

        for (const [unit, secondsInUnit] of Object.entries(timeIntervals)) {
            const diff = Math.round(diffInSeconds / secondsInUnit);
            if (Math.abs(diff) >= 1) {
                return formatter.format(diff, unit as Intl.RelativeTimeFormatUnit);
            }
        }

        return 'just now';
    }

    ngOnDestroy(): void {
        this.langSubscription?.unsubscribe();
    }
}