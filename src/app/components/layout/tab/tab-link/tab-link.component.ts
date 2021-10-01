import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'elder-tab-link',
  templateUrl: './tab-link.component.html',
  styleUrls: ['./tab-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
