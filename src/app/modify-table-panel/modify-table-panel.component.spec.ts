import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyTablePanelComponent } from './modify-table-panel.component';

describe('ModifyTablePanelComponent', () => {
  let component: ModifyTablePanelComponent;
  let fixture: ComponentFixture<ModifyTablePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyTablePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyTablePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
