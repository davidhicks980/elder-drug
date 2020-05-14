import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearanceTableComponent } from './clearance-table.component';

describe('ClearanceTableComponent', () => {
  let component: ClearanceTableComponent;
  let fixture: ComponentFixture<ClearanceTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearanceTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearanceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
