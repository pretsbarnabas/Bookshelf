import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslationService } from '../../../services/translation.service';

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
        TranslatePipe
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent {

    @Output() sidenavToggleClicked = new EventEmitter<void>();

    constructor(
        private translationService: TranslationService
      ) {}    

    localizationToggleValue: string = "en";
    isdarkModeOn = false;

    ngOnInit(){
        if(window.matchMedia('(prefers-color-scheme: dark)').matches)
            this.changeTheme()                    
        this.localizationToggleValue = this.translationService.checkPreferred()
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
}
