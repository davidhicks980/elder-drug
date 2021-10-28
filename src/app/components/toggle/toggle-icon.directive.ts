import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[toggle-icon]',
})
export class ToggleIconDirective {
  @HostBinding('class.is-toggled')
  @Input()
  toggled: boolean;
  @HostBinding('style.height')
  @HostBinding('style.width')
  get iconSize() {
    return 'calc(var(--icon-button--size) * var(--icon-button--icon-scale))';
  }
  toggle(force?: boolean) {
    this.toggled = typeof force === 'boolean' ? force : !this.toggled;
  }
}
