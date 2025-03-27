import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../services/global/auth.service';
import { UserModel } from '../../../models/User';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizedDatePipe } from '../../../pipes/date.pipe';
import { CommonModule, DatePipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'
import { AllTypeDisplayComponent } from "../../../utilities/components/all-type-display/all-type-display.component";

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        MatCardModule,
        TranslatePipe,
        CommonModule,
        LocalizedDatePipe,
        FlexLayoutModule,
        MatIconModule,
        MatButtonModule,
        AllTypeDisplayComponent
    ],
    providers: [DatePipe],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    encapsulation: ViewEncapsulation.None
})

export class ProfileComponent {
    private authService = inject(AuthService);

    constructor(
    ) {

    }

    loggedInUser: UserModel | null = null;
    roleDataHead: string = "";

    ngOnInit() {
        this.authService.loggedInUser$.subscribe(user => {
            this.loggedInUser = user;
            this.roleDataHead = `PROFILE.PROFILECARD.ROLETABLE.${user?.role.toLocaleUpperCase()}`;
        });
    }
}
