import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSourceComponent } from './login-source.component';

describe('LoginSourceComponent', () => {
  let component: LoginSourceComponent;
  let fixture: ComponentFixture<LoginSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
