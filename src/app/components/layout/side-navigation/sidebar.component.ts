import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { Observable, of } from 'rxjs';

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
  setSearchingStatus(searching: boolean) {
    this.searching = searching;
  }
}
