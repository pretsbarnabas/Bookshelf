import { Component, ViewEncapsulation } from '@angular/core';
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
import { UserLoggedInModel } from '../../models/User';

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

    loggedInUser: UserLoggedInModel | null = null;

    constructor(
        public authService: AuthService,
        private router: Router,
        private spinner: NgxSpinnerService
    ) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart)
                this.spinner.show();
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
    }

    ngOnInit() {
        this.authService.setLoggedInUser();
    }
}
