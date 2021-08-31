import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ResizeService } from '../../../services/resize.service';

@Component({
  selector: 'elder-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'sidebar' },
})
export class SidebarComponent {
  @HostBinding('class.is-searching') searching: boolean = false;

  isSearching$: Observable<boolean> = of(false);
  setClass(searching: boolean) {
    this.searching = searching;
  }
  constructor(public size: ResizeService) {}
}
