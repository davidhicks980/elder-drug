import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  HostBinding,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { destroy } from '../../functions/destroy';

import { LayoutService } from '../../services/layout.service';
import { SearchDrawerBrandDirective, SearchDrawerToggleDirective } from './search-drawer.directive';

@Component({
  selector: 'elder-search-drawer',
  templateUrl: './search-drawer.component.html',
  styleUrls: ['./search-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFormDrawer implements OnDestroy {
  @HostBinding('class.is-searching') searching: boolean = false;
  @ContentChild(SearchDrawerToggleDirective)
  toggle: SearchDrawerToggleDirective;
  @ContentChild(SearchDrawerBrandDirective)
  brand: SearchDrawerBrandDirective;

  destroy$ = new Subject();
  ngOnDestroy() {
    this.destroy$.next(true);
  }
  constructor(public layoutService: LayoutService) {
    this.layoutService.pinnedSearch$.pipe(destroy(this)).subscribe((isPinned) => {
      this.searching = isPinned;
    });
  }
}
