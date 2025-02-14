import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FooterComponent } from './footer/footer.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterModule,
        RouterOutlet,
        NavbarComponent,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
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

    constructor(
        public authService: AuthService
      ) {}

    
    ngOnInit() {
        this.authService.checkLogin();
    }
}
