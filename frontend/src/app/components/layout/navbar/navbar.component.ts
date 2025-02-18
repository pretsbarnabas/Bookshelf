import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../../services/auth.service';
// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FlexLayoutModule, MediaChange, MediaObserver } from "@angular/flex-layout";
import { TranslatePipe } from '@ngx-translate/core';
import { TranslationService } from '../../../services/translation.service';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { map } from 'rxjs';


@Component({
    selector: 'app-navbar',
    imports: [
        RouterModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        FlexLayoutModule,
        MatSlideToggleModule,
        MatButtonToggleModule,
        MatMenuModule,
        MatMenuTrigger,
        MatTooltipModule,
        TranslatePipe
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('rotate', [
            state('default', style({ transform: 'rotate(0deg)' })),
            state('clicked', style({ transform: 'rotate(-90deg)' })),
            transition('default => clicked', animate('250ms ease-in')),
            transition('clicked => default', animate('250ms ease-out')),
        ]),
        trigger('pulse', [
            transition('false => true', [
                animate('750ms ease-in-out', keyframes([
                    style({ transform: 'translateY(0) rotate(0deg)', offset: 0 }),
                    style({ transform: 'translateY(-2.5px) rotate(10deg)', offset: 0.2 }),
                    style({ transform: 'translateY(2.5px) rotate(-10deg)', offset: 0.4 }),
                    style({ transform: 'translateY(-2.5px) rotate(10deg)', offset: 0.6 }),
                    style({ transform: 'translateY(2.5px) rotate(-10deg)', offset: 0.8 }),
                    style({ transform: 'translateY(0) rotate(0deg)', offset: 1 })
                ]))
            ])
        ])
    ]
})
export class NavbarComponent {

    @Output() sidenavToggleClicked = new EventEmitter<void>();

    constructor(
        private translationService: TranslationService,
        public authService: AuthService,
        private router: Router,
        private mediaObserver: MediaObserver
    ) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.activeRoute = event.urlAfterRedirects;
            }
        });
    }


    localizationToggleValue: string = "en";
    isdarkModeOn = false;

    settingsIconState = 'default';
    activeRoute: string = '';
    isMdOrBeyond: boolean = false;

    ngOnInit() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches)
            this.changeTheme()
        this.localizationToggleValue = this.translationService.checkPreferred()
        this.mediaObserver.asObservable().pipe(
            map((changes: MediaChange[]) => {
                const isMdOrBeyond = changes.some(change => ['md', 'lg', 'xl'].includes(change.mqAlias));
                this.isMdOrBeyond = isMdOrBeyond;
            })
        ).subscribe();
    }

    changeTheme() {
        this.isdarkModeOn = !this.isdarkModeOn;
        document.body.classList.toggle('darkMode')
    }

    toggleSideNav() {
        this.sidenavToggleClicked.emit();
    }

    changeLanguage(event: any) {
        this.localizationToggleValue = event.value;
        this.translationService.changeLanguage(this.localizationToggleValue);
    }

    isActive(route: string): boolean {
        return this.activeRoute.startsWith(route);
    }
}
