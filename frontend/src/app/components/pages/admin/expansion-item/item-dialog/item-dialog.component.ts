import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserModel } from '../../../../../models/User';
import { Book } from '../../../../../models/Book';
import { Review } from '../../../../../models/Review';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-item-dialog',
    imports: [
        MatDialogModule,
        MatButtonModule,
        CommonModule,
        TranslatePipe
    ],
    templateUrl: './item-dialog.component.html',
    styleUrl: './item-dialog.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class ItemDialogComponent {
    data = inject(MAT_DIALOG_DATA)
    private dialogRef = inject(MatDialogRef<ItemDialogComponent>)

    emitResult(result: boolean){
        this.dialogRef.close(result);
    }


            
}
