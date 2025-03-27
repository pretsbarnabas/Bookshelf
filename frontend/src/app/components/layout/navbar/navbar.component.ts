import { Component, EventEmitter, inject, Output, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../../services/global/auth.service';
// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FlexLayoutModule, MediaChange, MediaObserver } from "@angular/flex-layout";
import { TranslatePipe } from '@ngx-translate/core';
import { TranslationService } from '../../../services/global/translation.service';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { map, shareReplay } from 'rxjs';
import { RouterButtonComponent } from "../router-button/router-button.component";
import { UserModel } from '../../../models/User';
import { ThemeService } from '../../../services/global/theme.service';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { formatRemainingTime } from '../../../utilities/formatRemainingTime';


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
        TranslatePipe,
        RouterButtonComponent,
        MatBadgeModule,
        CommonModule
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
    private breakpointObserver = inject(BreakpointObserver);
    private translationService = inject(TranslationService);
    public authService = inject(AuthService);
    private themeService = inject(ThemeService);
    private mediaObserver = inject(MediaObserver);

    @Output() sidenavToggleClicked = new EventEmitter<void>();

    isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset])
        .pipe(
            map(result => result.matches),
            shareReplay()
        );

    loggedInUser: UserModel | null = null;
    remainingTime: number = 60000;

    localizationToggleValue: string = "en";

    currentTheme: "light" | "dark" = "light";
    isEyeSaveModeOn: boolean = false;
    colorBlindnessMode: "red-green" | "blue-yellow" | "monochrome" | "none" = "none";
    isLastColorBlindnessDiff: boolean = true

    settingsIconState = 'default';
    isMdOrBeyond: boolean = false;


    ngOnInit() {
        this.currentTheme = this.themeService.checkPreferredTheme();
        this.isEyeSaveModeOn = this.themeService.checkEyeSaverMode();
        this.colorBlindnessMode = this.themeService.checkColorBlindnessMode() as "red-green" | "blue-yellow" | "monochrome" | "none";
        this.localizationToggleValue = this.translationService.checkPreferred()
        this.mediaObserver.asObservable().pipe(
            map((changes: MediaChange[]) => {
                const isMdOrBeyond = changes.some(change => ['md', 'lg', 'xl'].includes(change.mqAlias));
                this.isMdOrBeyond = isMdOrBeyond;
            })
        ).subscribe();
        this.authService.loggedInUser$.subscribe(user => {
            this.loggedInUser = user;
        });
        this.authService.remainingTime$.subscribe(time => {
            this.remainingTime = time;
        });
        if (this.colorBlindnessMode !== "none" && localStorage.getItem("wasColorBlindnessNone") === 'true') {
            localStorage.setItem("wasColorBlindnessNone", 'false')
            this.isLastColorBlindnessDiff = true
        }
        else
            this.isLastColorBlindnessDiff = false
    }

    changeTheme() {
        this.currentTheme = this.currentTheme === "light" ? "dark" : "light"
        this.themeService.changeTheme(this.currentTheme)
    }

    toggleSideNav() {
        this.sidenavToggleClicked.emit();
    }

    changeLanguage(event: any) {
        this.localizationToggleValue = event.value;
        this.translationService.changeLanguage(this.localizationToggleValue);
    }

    changeEyeSaveMode() {
        this.isEyeSaveModeOn = !this.isEyeSaveModeOn;
        this.themeService.changeEyeSaveMode(this.isEyeSaveModeOn)
    }

    changeColorBlindnessOverlay(type: string) {
        if (this.colorBlindnessMode === type)
            this.colorBlindnessMode = "none";
        else
            this.colorBlindnessMode = type as "red-green" | "blue-yellow" | "monochrome" | "none";
        this.themeService.changeColorBlindessMode(this.colorBlindnessMode);
    }

    displayRemainingTime(): string{
        return formatRemainingTime(this.remainingTime);
    }    
}
