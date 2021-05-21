import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ResizeService } from '../../../services/resize.service';

@Component({
  selector: 'elder-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  @Input() buttonDisabled = false;
  @Input() mobile: boolean = false;
  @HostBinding('class.is-searching') searching: boolean = false;
  isMobile$: Observable<boolean>;
  isSearching$: Observable<boolean>;
  shiftSearch($event) {
    this.searching = $event;
  }

  constructor(public size: ResizeService) {
    this.isSearching$ =
      this.size._isSearching$.pipe(tap((is) => (this.searching = is))) ||
      of(false);
  }
}
