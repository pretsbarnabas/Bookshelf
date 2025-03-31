import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from '../../app/components/layout/footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';


describe('FooterComponent', () => {
    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                FooterComponent,
                TranslateModule.forRoot(),
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('Should get the quote', () => {
        spyOn(FooterComponent.prototype, 'getQuote').and.callThrough();
        component.ngOnInit();
        expect(FooterComponent.prototype.getQuote).toHaveBeenCalled();
        expect(component.quote).toBeDefined();
    });

});

