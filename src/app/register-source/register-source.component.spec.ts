import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSourceComponent } from './register-source.component';

describe('RegisterSourceComponent', () => {
  let component: RegisterSourceComponent;
  let fixture: ComponentFixture<RegisterSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
