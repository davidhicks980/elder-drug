import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, HostBinding, Output } from '@angular/core';
import { Observable, of } from 'rxjs';

import { LayoutService } from '../../../services/layout.service';
import { SidebarBrandDirective, SidebarToggleDirective } from './sidebar-brand.directive';

@Component({
  selector: 'elder-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'sidebar' },
})
export class SidebarComponent {
  @HostBinding('class.is-searching') searching: boolean = false;
  @Output('searching') searchEmitter: EventEmitter<boolean> = new EventEmitter();
  @ContentChild(SidebarToggleDirective)
  toggle: SidebarToggleDirective;
  @ContentChild(SidebarBrandDirective)
  brand: SidebarBrandDirective;
  isSearching$: Observable<boolean> = of(false);
  setSearchingStatus(searching: boolean) {
    this.searching = searching;
  }
  constructor(public layoutService: LayoutService) {}
}
