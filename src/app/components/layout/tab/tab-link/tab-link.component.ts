import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';

import { fadeInAnimation } from '../../../../animations';

@Component({
  selector: 'elder-tab-link',
  templateUrl: './tab-link.component.html',
  styleUrls: ['./tab-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation],
})
export class TabLinkComponent implements OnInit {
  @Input() active: boolean = false;
  @Input() rounded: boolean = false;
  @Input() collapsed: boolean = false;
  @Input() title: string = '';
  @Input() focused: boolean = false;
  @HostBinding('attr.rounded') get isActive() {
    return this.rounded;
  }
  @HostBinding('attr.active') get isRounded() {
    return this.active;
  }
  @HostBinding('attr.collapsed') get isCollapsed() {
    return this.collapsed;
  }
  @HostBinding('attr.focused') get isFocused() {
    return this.focused;
  }

  constructor() {}

  ngOnInit(): void {}
}
