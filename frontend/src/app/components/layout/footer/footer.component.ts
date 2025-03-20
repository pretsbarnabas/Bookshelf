import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from "@angular/flex-layout";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-footer',
    imports: [
        MatToolbarModule,
        FlexLayoutModule,
        TranslatePipe
    ],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    encapsulation: ViewEncapsulation.None,

})
export class FooterComponent {

    currentLang: string = 'en';
    quote: string = 'G';

    ngOnInit() {
        this.quote = this.getQuote();
    }

    getQuote(): string {
        const hour = new Date().getHours();

        const random = Math.floor(Math.random() * 3) + 1;         

        if (hour >= 6 && hour < 12)
            return `M${random}`;
        if (hour >= 12 && hour < 18)
            return `D${random}`;
        if (hour >= 18 && hour < 22)
            return `E${random}`;
        if(hour >= 22 || hour < 6)
            return `N${random}`;
        else
            return 'G';
    }
}
