import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartTimeComponent } from './cart-time.component';

describe('CartTimeComponent', () => {
  let component: CartTimeComponent;
  let fixture: ComponentFixture<CartTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
