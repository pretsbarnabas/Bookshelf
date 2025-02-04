import { Component, ViewEncapsulation } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule } from '@angular/router';


@Component({
    selector: 'app-navbar',
    imports: [
        RouterModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        FlexLayoutModule,
        MatSlideToggleModule,
        MatButtonToggleModule
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent {

    localizationToggleValue: string = "en";
    isdarkModeOn = false;

    changeTheme() {
        this.isdarkModeOn = !this.isdarkModeOn;
        document.body.classList.toggle('darkMode')
    }
}
