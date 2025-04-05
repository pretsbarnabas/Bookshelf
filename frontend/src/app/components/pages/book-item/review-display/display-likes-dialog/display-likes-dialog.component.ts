import { CommonModule } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-display-likes-dialog',
    imports: [
        MatDialogModule,
        MatButtonModule,
        CommonModule,
        TranslatePipe,
        MatTabsModule,
        MatIconModule
    ],
    templateUrl: './display-likes-dialog.component.html',
    styleUrl: './display-likes-dialog.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class DisplayLikesDialogComponent {
    data = inject(MAT_DIALOG_DATA);

}
