import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

import { tabLinkAnimations } from './tab-link.animations';

@Component({
  selector: 'elder-tab-link',
  templateUrl: './tab-link.component.html',
  styleUrls: ['./tab-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    tabLinkAnimations.clipTab('RoundTab', 'unshifted', 'shifted'),
    tabLinkAnimations.roundedSVG('Rounded'),
  ],
})
export class TabLinkComponent {
  @HostBinding('class.rounded')
  @Input()
  rounded: boolean = false;

  @HostBinding('class.selected')
  @Input()
  selected: boolean = false;

  @HostBinding('class.collapsed')
  @Input()
  collapsed: boolean = false;
}
