import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutStatus, ResizeService, ScreenStatus } from 'src/app/services/resize.service';

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

  buttonDisabled = false;
  constructor(public state: ResizeService) {
    this.state.windowWidth$.subscribe((layoutStatus: LayoutStatus): void => {
      this.layout = layoutStatus;
      this.sidenavOpen = this.layout.sidenavOpen;
    });
  }
}
