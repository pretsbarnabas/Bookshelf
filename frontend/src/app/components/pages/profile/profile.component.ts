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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { ItemDialogComponent } from '../../../utilities/components/all-type-display/expansion-item/item-dialog/item-dialog.component';
import { UserService } from '../../../services/page/user.service';
import { HttpErrorResponse } from '@angular/common/http';

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
        AllTypeDisplayComponent,
        MatExpansionModule
    ],
    providers: [DatePipe],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    encapsulation: ViewEncapsulation.None
})

export class ProfileComponent {
    private authService = inject(AuthService);
    private userService = inject(UserService);
    readonly dialog = inject(MatDialog);

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

    handleProfile(_type: 'edit' | 'delete') {
        this.loggedInUser!.type = 'user';
        const dialogRef = this.dialog.open(ItemDialogComponent, {
            data: {
                type: _type,
                item: this.loggedInUser,
                isAdmin: false,
                isProfile: true
            },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                const userId: string | number = this.loggedInUser!._id
                this.authService.logOut();
                this.userService.deleteUser(userId).subscribe({
                    next: async (response) => {
                        console.log(response)
                    },
                    error: (err: HttpErrorResponse) => console.log(err)
                });
            }
            if (result.result === true) {
                this.userService.updateUser(this.loggedInUser!._id, result.modifiedData).subscribe({
                    next: async (response) => {                                          
                        window.location.reload();                        
                    },
                    error: (err: HttpErrorResponse) => console.log(err)
                })
            }
        })
    }
}
