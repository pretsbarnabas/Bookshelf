import { Component, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FooterComponent } from './footer/footer.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatExpansionModule,
        RouterModule,
        RouterOutlet,
        NavbarComponent,
        TranslatePipe,
        FooterComponent,
        NgxSpinnerModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
    title = 'frontend';
    activeRoute: string = '';

    constructor(
        public authService: AuthService,
        private router: Router
    ) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.activeRoute = event.urlAfterRedirects;
            }
        });
    }

    ngOnInit() {
        this.authService.setLoggedInUser();
    }

    isActive(route: string): boolean {
        return this.activeRoute.startsWith(route);
    }
}
