import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NavigationStateService } from '../../../services/global/navigation-state.service';


@Component({
    selector: 'router-button',
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        RouterModule,
        MatMenuModule,
        TranslatePipe
    ],
    templateUrl: './router-button.component.html',
    styleUrl: './router-button.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class RouterButtonComponent {
    private navService = inject(NavigationStateService);
    @Input() payload?: { route: string, icon?: string, localReference: string, isMatMenu?: boolean, isSidenav?: boolean, userId?: string | number };

    constructor(
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.activeRoute = event.urlAfterRedirects;
            }
        });
    }

    activeRoute: string = '';

    ngAfterViewInit() {
        this.cdr.detectChanges();
    }

    isActive(route?: string): boolean {
        if (route && route == 'profile')
            return this.activeRoute.startsWith(route);
        return false
    }

    navigateToProfile() {
        this.navService.setState('/profile', this.payload?.userId!.toString()!, '')
        this.router.navigate(['profile']);
    }
}
