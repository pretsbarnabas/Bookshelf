import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayLikesDialogComponent } from './display-likes-dialog.component';

describe('DisplayLikesDialogComponent', () => {
  let component: DisplayLikesDialogComponent;
  let fixture: ComponentFixture<DisplayLikesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayLikesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayLikesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
