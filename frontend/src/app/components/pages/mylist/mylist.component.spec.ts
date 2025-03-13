import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MylistComponent } from './mylist.component';

describe('MylistComponent', () => {
  let component: MylistComponent;
  let fixture: ComponentFixture<MylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MylistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
