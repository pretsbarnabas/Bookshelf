// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { SummaryItemComponent } from '../../app/components/pages/summary-item/summary-item.component';
// import { TranslateModule } from '@ngx-translate/core';
// import { provideHttpClient } from '@angular/common/http';
// import { provideConfig } from '../../app/services/global/config.service';
// import { CrudService } from '../../app/services/global/crud.service';
// import { Subject } from 'rxjs';
// import { ActivatedRoute, Router } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';

// describe('SummaryItemComponent', () => {
//     let component: SummaryItemComponent;
//     let fixture: ComponentFixture<SummaryItemComponent>;

//     let router: Router;

//     beforeEach(async () => {

//         await TestBed.configureTestingModule({
//             imports: [
//                 SummaryItemComponent,
//                 TranslateModule.forRoot(),
//             ],
//             providers: [
//                 provideHttpClient(),
//                 provideConfig(['apiurl', 'https://testing.com']),
//                 CrudService,
//                 {
//                     provide: ActivatedRoute,
//                     useValue: 'summary-item'
//                 },
//             ]
//         }).compileComponents();

//         fixture = TestBed.createComponent(SummaryItemComponent);
//         TestBed.inject(ActivatedRoute);
//         router = TestBed.inject(Router);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('Should create the component', () => {
//         expect(component).toBeTruthy();
//     });
// });
