import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLogicComponent } from './table-logic.component';

describe('TableLogicComponent', () => {
  let component: TableLogicComponent;
  let fixture: ComponentFixture<TableLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
