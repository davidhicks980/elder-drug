import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { StateService } from 'src/app/state.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  sidenavActive: boolean;
  addNewItem(value: string) {}
  iconName: string = 'menu';

  constructor(public stateService: StateService) {
    stateService.sidenavStatus$.subscribe((isOpen: boolean) => {
      this.sidenavActive = isOpen;
    });
  }

  ngOnInit(): void {
    this.sidenavActive = true;
  }
}
