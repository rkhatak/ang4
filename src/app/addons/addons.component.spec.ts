import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonsComponent } from './addons.component';

describe('AddonsComponent', () => {
  let component: AddonsComponent;
  let fixture: ComponentFixture<AddonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
