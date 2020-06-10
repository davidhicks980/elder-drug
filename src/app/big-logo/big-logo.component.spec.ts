import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BigLogoComponent } from './big-logo.component';

describe('BigLogoComponent', () => {
  let component: BigLogoComponent;
  let fixture: ComponentFixture<BigLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BigLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BigLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
