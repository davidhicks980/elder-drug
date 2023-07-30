import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElderIconButtonComponent } from './toggle-plain.component';

describe('TogglePlainComponent', () => {
  let component: ElderIconButtonComponent;
  let fixture: ComponentFixture<ElderIconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElderIconButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElderIconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
