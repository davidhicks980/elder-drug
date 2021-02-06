import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutStatus, ScreenStatus, StateService } from 'src/app/services/state.service';

@Component({
  selector: 'elder-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  sidenavActive: boolean;
  screenSize: ScreenStatus;
  layout: LayoutStatus;
  sidenavOpen: boolean;

  constructor(public state: StateService) {
    this.state.windowWidth$.subscribe((layoutStatus: LayoutStatus): void => {
      this.layout = layoutStatus;
      this.sidenavOpen = this.layout.sidenavOpen;
    });
  }
}
