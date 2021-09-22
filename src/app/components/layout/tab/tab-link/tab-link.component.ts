import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'elder-tab-link',
  templateUrl: './tab-link.component.html',
  styleUrls: ['./tab-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabLinkComponent {
  @Input() active: boolean = false;
  @Input() rounded: boolean = false;
  @Input() collapsed: boolean = false;
  @Input() title: string = '';
  @Input() focused: boolean = false;
  @HostBinding('class.is-rounded') get isActive() {
    return this.rounded;
  }
  @HostBinding('class.is-active') get isRounded() {
    return this.active;
  }
  @HostBinding('class.is-collapsed') get isCollapsed() {
    return this.collapsed;
  }
  @HostBinding('class.is-focused') get isFocused() {
    return this.focused;
  }
}
