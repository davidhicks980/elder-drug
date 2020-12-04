import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EnterDrugFormComponent } from './enter-drug-form.component';

describe('EnterDrugFormComponent', () => {
  let component: EnterDrugFormComponent;
  let fixture: ComponentFixture<EnterDrugFormComponent>;

  beforeEach(waitForAsync(() => {
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
