import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { LocalizedDatePipe } from '../../../../pipes/date.pipe';
import { CommonModule, DatePipe } from '@angular/common';
import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';
import { TranslatePipe } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ItemDialogComponent } from './item-dialog/item-dialog.component';
import { UserModel } from '../../../../models/User';
import { Book } from '../../../../models/Book';
import { Review } from '../../../../models/Review';

@Component({
    selector: 'expansion-item',
    imports: [
        MatExpansionModule,
        MatButtonModule,
        MatIconModule,
        LocalizedDatePipe,
        CommonModule,
        TranslatePipe,
        MatCardModule,
        ItemDialogComponent
    ],
    providers: [DatePipe],
    templateUrl: './expansion-item.component.html',
    styleUrl: './expansion-item.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class ExpansionItemComponent {
    readonly dialog = inject(MatDialog);
    @Input() payload?: { type: 'user' | 'book' | 'review', item: any }
    animate: boolean = false;

    ngOnChanges() {
        if (this.payload?.item && this.payload?.type === 'user' && !this.payload.item.imageUrl) {
            this.payload.item.profile_image = createAvatar(bottts, { seed: this.payload?.item.username }).toDataUri();
        }
    }

    openDialog(type: string) {
        console.log(type)
        this.payload!.item.type = this.payload?.type;        
        const dialogRef = this.dialog.open(ItemDialogComponent, {
            data: {
                type: type,
                item: this.payload?.item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('Dialog result:', result);
        })
    }
}
