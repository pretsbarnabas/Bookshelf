import { Component, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../services/auth.service';
import { UserLoggedInModel } from '../../../models/User';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizedDatePipe } from '../../../pipes/date.pipe';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        MatCardModule,
        TranslatePipe,
        CommonModule,
        LocalizedDatePipe
    ],
    providers: [DatePipe],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class ProfileComponent {

    constructor(
        private authService: AuthService
    ) {

    }

    loggedInUser: UserLoggedInModel | null = null;
    roleDataHead: string = "";

    ngOnInit() {
        this.authService.loggedInUser$.subscribe(user => {
            this.loggedInUser = user;
            this.roleDataHead = `PROFILE.PROFILECARD.ROLETABLE.${user?.role.toLocaleUpperCase()}`;
        });        
    }
}
