import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SummaryService } from '../../../services/page/summary.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SummaryModel } from '../../../models/Summary';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { LocalizedDatePipe } from "../../../pipes/date.pipe";
import * as CryptoJS from "crypto-js";
import { ConfigService } from '../../../services/global/config.service';

@Component({
    selector: 'app-summary-item',
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        TranslatePipe,
        LocalizedDatePipe
    ],
    templateUrl: './summary-item.component.html',
    styleUrl: './summary-item.component.scss',
    providers: [DatePipe],
    encapsulation: ViewEncapsulation.None,
})
export class SummaryItemComponent {
    private summaryService = inject(SummaryService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private configService = inject(ConfigService);

    summaryId: string | null = null;
    summary?: SummaryModel;

    ngOnInit() {        
        this.summaryId = CryptoJS.AES.decrypt(this.route.snapshot.paramMap.get('id')!, this.configService.get('SECURITY_KEY')).toString(CryptoJS.enc.Utf8);
        if (this.summaryId) {
            this.summaryService.getSummaryById(this.summaryId).subscribe(summary => {
                this.summary = summary;
            });
        }
    }

    onBack() {
        this.router.navigate(['/summaries']);
    }

    navigateToProfile(_id: string | number) {                
        this.router.navigate(['profile', CryptoJS.AES.encrypt(_id.toString(), this.configService.get('SECURITY_KEY')).toString()]);
    }
}
