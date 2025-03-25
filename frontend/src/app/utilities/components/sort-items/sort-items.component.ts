import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'sort-items',
    imports: [        
        MatSelectModule,
        FormsModule,
        MatRadioModule,
        TranslatePipe
    ],
    templateUrl: './sort-items.component.html',
    styleUrl: './sort-items.component.scss'
})
export class SortItemsComponent {
    @Input() type: 'user' | 'book' | 'review' | 'summary' | 'comment' = 'user';
    @Output() sortItems = new EventEmitter<{ field: string, mode: 'asc' | 'desc' }>();

    sortedFields: string[] = [];
    selectedField = '';
    mode: 'asc' | 'desc' = 'asc';

    constructor() { }

    ngOnChanges() {
        this.selectedField = '';
        this.sortedFields = this.sortedFieldsMapping[this.type];
    }

    private sortedFieldsMapping = {
        user: ['_id', 'username', 'role', 'created_at', 'updated_at', 'last_login'],
        book: ['_id', 'user_id' , 'title', 'author', 'release', 'genre', 'added_at', 'updated_at'],
        review: ['_id', 'user._id', 'score', 'created_at', 'updated_at'],
        summary: ['_id', 'updated_at', 'user.username', 'user._id'],
        comment: ['_id', 'updated_at', 'created_at', 'user.username', 'user._id']
    };

    emitChangedValue() {
        this.sortItems.emit({ field: this.selectedField, mode: this.mode })
    }

}
