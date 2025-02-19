import { Component, ViewEncapsulation } from '@angular/core';
import { FlexLayoutModule } from "@angular/flex-layout";
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
    selector: 'app-not-found',
    imports: [
        FlexLayoutModule,
        MatProgressSpinnerModule,
        TranslatePipe
    ],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class NotFoundComponent {

    currentTime: number = 20;
    spinnerValue: number = 100;
    exchangeRate: number = this.spinnerValue/this.currentTime;
    private countDown: Subscription = new Subscription();

    constructor(
        private router: Router
    ) { }

    ngOnInit() {
        this.startCountDown();
    }

    startCountDown() {
        this.countDown = interval(1000).subscribe(() => {
            if (this.currentTime > 0) {
                this.currentTime--;
                this.spinnerValue = this.spinnerValue - this.exchangeRate;
            } else {
                this.router.navigate(['/home']);
                this.countDown.unsubscribe();
            }
        });
    }

    ngOnDestroy(): void {
        this.countDown.unsubscribe();
    }
}
