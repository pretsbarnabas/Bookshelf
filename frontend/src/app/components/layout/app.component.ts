import { Component, inject, ViewEncapsulation } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FooterComponent } from './footer/footer.component';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '../../services/global/auth.service';
import { TruncatePipe } from "../../pipes/truncate.pipe";
import { RouterButtonComponent } from "./router-button/router-button.component";
import { UserModel } from '../../models/User';
import { formatRemainingTime } from '../../utilities/formatRemainingTime';
import { TranslationService } from '../../services/global/translation.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        MatSidenavModule,
        MatExpansionModule,
        RouterModule,
        RouterOutlet,
        NavbarComponent,
        TranslatePipe,
        FooterComponent,
        NgxSpinnerModule,
        TruncatePipe,
        RouterButtonComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
    title = 'frontend';
    public authService = inject(AuthService);
    private router = inject(Router);
    private spinner = inject(NgxSpinnerService);
    private translationService = inject(TranslationService);

    loggedInUser: UserModel | null = null;
    remainingTime: number = 60000;
    currLang: string = 'en';

    constructor(
    ) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.spinner.show();             
            }

            else if (
                event instanceof NavigationEnd ||
                event instanceof NavigationCancel ||
                event instanceof NavigationError
            )
                this.spinner.hide();
        });
        this.authService.loggedInUser$.subscribe(user => {
            this.loggedInUser = user;
        })
        this.authService.remainingTime$.subscribe(time => {
            this.remainingTime = time;
        });
        this.translationService.currentLanguage$.subscribe(lang => {
            this.currLang = lang;
        });
    }

    ngOnInit() {
        this.authService.setLoggedInUser();
    }

    displayRemainingTime(): string {
        return formatRemainingTime(this.remainingTime, this.currLang);
    }
}
