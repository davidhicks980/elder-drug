import { Component, AfterViewInit, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ScreenStatus, StateService } from './state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.state.toggleSidenav();
  }
  constructor(
    private breakpointObserver: BreakpointObserver,
    private state: StateService
  ) {}
  title = 'ElderDrug';
}
