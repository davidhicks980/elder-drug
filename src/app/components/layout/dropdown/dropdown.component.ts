import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { NavigationService } from '../../../services/navigation.service';
import { Table } from '../../../services/table.service';

@Component({
  selector: 'elder-dropdown',
  templateUrl: `./dropdown.component.html`,
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
  hiddenTabs: Observable<Table[]>;
  constructor(nav: NavigationService) {
    this.hiddenTabs = nav.hiddenTabs as Observable<Table[]>;
  }

  ngOnInit(): void {}
}
