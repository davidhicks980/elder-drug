import { Component, OnInit } from '@angular/core';
import { StateService } from './state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.state.toggleSidenav();
  }
  constructor(private state: StateService) {}
  title = 'ElderDrug';
}
