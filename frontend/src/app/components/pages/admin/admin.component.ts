import {
    Component,
    ViewEncapsulation,
    OnInit
} from '@angular/core';
import { AllTypeDisplayComponent } from '../../../utilities/components/all-type-display/all-type-display.component';

@Component({
    selector: 'app-admin',
    imports: [
        AllTypeDisplayComponent
    ],
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AdminComponent implements OnInit {

    ngOnInit() {

    }
}
