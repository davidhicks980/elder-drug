import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { NavigationService } from '../../../services/navigation.service';
import { Table } from '../../../services/table.service';

@Component({
  selector: 'elder-dropdown',
  template: `<div
    role="menu"
    aria-haspopup="true"
    class="has-dropdown"
    tabindex="0"
  >
    <button class="nav-button">
      <mat-icon
        class="overflow-menu-button"
        svgIcon="overflow_menu_vertical"
      ></mat-icon>
    </button>
    <ul role="menubar" aria-hidden="false" class="nav-menu dropdown">
      <span *ngFor="let tab of hiddenTabs | async"
        ><li class="active">
          <button tabindex="0" role="menuitem" class="menu-item">
            <span class="ellipsis">tab.ShortName</span>
          </button>
        </li>
      </span>
    </ul>
  </div> `,
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
  hiddenTabs: Observable<Table[]>;
  constructor(nav: NavigationService) {
    this.hiddenTabs = nav.hiddenTabs as Observable<Table[]>;
  }

  ngOnInit(): void {}
}
