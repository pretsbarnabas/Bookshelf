import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterButtonComponent } from './router-button.component';

describe('RouterButtonComponent', () => {
  let component: RouterButtonComponent;
  let fixture: ComponentFixture<RouterButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouterButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
