import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { LocalizedDatePipe } from '../../../../pipes/date.pipe';
import { CommonModule, DatePipe } from '@angular/common';
import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'expansion-item',
    imports: [
        MatExpansionModule,
        MatButtonModule,
        MatIconModule,
        LocalizedDatePipe,
        CommonModule,        
        TranslatePipe
    ],
    providers: [DatePipe],
    templateUrl: './expansion-item.component.html',
    styleUrl: './expansion-item.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class ExpansionItemComponent {
    @Input() payload?: { type: 'user' | 'book' | 'review', item: any }

    ngOnInit() {
        if(this.payload?.item && this.payload?.type === 'user' && !this.payload.item.imageUrl){
            this.payload.item.profile_image = createAvatar(bottts, { seed: this.payload?.item.username }).toDataUri();
        }
    }    
}
