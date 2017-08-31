import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderLinkFormComponent } from './order-link-form.component';

describe('OrderLinkFormComponent', () => {
  let component: OrderLinkFormComponent;
  let fixture: ComponentFixture<OrderLinkFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderLinkFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderLinkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
