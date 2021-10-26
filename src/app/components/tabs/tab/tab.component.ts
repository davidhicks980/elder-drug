import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'elder-tab-link',
  templateUrl: './tab.component.svg',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
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
