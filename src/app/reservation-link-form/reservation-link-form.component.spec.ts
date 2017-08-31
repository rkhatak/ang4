import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationLinkFormComponent } from './reservation-link-form.component';

describe('ReservationLinkFormComponent', () => {
  let component: ReservationLinkFormComponent;
  let fixture: ComponentFixture<ReservationLinkFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationLinkFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationLinkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
