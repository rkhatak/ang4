import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchGeoaddressComponent } from './search-geoaddress.component';

describe('SearchGeoaddressComponent', () => {
  let component: SearchGeoaddressComponent;
  let fixture: ComponentFixture<SearchGeoaddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchGeoaddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchGeoaddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
