import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallLogoComponent } from './small-logo.component';

describe('SmallLogoComponent', () => {
  let component: SmallLogoComponent;
  let fixture: ComponentFixture<SmallLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmallLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
