import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'custom-paginator',
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        TranslateModule
    ],
    templateUrl: './custom-paginator.component.html',
    styleUrl: './custom-paginator.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class CustomPaginatorComponent {
    @Input() totalPages: number = 0;
    @Input() pageSize: number = 10;
    @Input() pageIndex: number = 0;
    @Input() pageSizeOptions: number[] = [5, 10, 20];
    prevPageSize: number = 10;

    @Output() pageChanged = new EventEmitter<{ pageIndex: number; pageSize: number }>();

    goToPreviousPage(): void {
        if (this.pageIndex > 0) {
            this.pageIndex--;
            this.emitPageChange();
        }
    }

    goToNextPage(): void {
        if (this.pageIndex < this.totalPages - 1) {
            this.pageIndex++;
            this.emitPageChange();
        }
    }

    goToFirstPage(): void {
        if (this.pageIndex > 0) {
            this.pageIndex = 0;
            this.emitPageChange();
        }
    }

    goToLastPage(): void {
        if (this.pageIndex < this.totalPages - 1) {
            this.pageIndex = this.totalPages - 1;
            this.emitPageChange();
        }
    }

    onPageSizeChange(): void {    
        if(this.prevPageSize < this.pageSize)    
            this.pageIndex = 0;
        this.prevPageSize = this.pageSize;
        this.emitPageChange();
    }

    private emitPageChange(): void {
        this.pageChanged.emit({ pageIndex: this.pageIndex, pageSize: this.pageSize });
    }

}
