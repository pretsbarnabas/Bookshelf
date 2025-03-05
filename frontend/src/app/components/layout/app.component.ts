import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FooterComponent } from './footer/footer.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { AuthService } from '../../services/auth.service';
import { TruncatePipe } from "../../pipes/truncate.pipe";
import { RouterButtonComponent } from "./router-button/router-button.component";

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
        RouterButtonComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
    title = 'frontend';

    constructor(
        public authService: AuthService,
    ) { }

    ngOnInit() {
        this.authService.setLoggedInUser();
    }
}
