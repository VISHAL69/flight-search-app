import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForms } from './search-forms';

describe('SearchForms', () => {
  let component: SearchForms;
  let fixture: ComponentFixture<SearchForms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchForms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchForms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
