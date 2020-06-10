import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterDrugFormComponent } from './enter-drug-form.component';

describe('EnterDrugFormComponent', () => {
  let component: EnterDrugFormComponent;
  let fixture: ComponentFixture<EnterDrugFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterDrugFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterDrugFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
