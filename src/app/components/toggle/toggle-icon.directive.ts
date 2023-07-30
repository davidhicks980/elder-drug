import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[toggle-icon]',
  host: {
    'style.z-index': '1',
    'style.width':
      'calc(var(--icon-button--width, var(--icon-button--size)) * var(--icon-button--icon-scale))',
    'style.height':
      'calc(var(--icon-button--height, var(--icon-button--size)) * var(--icon-button--icon-scale))',
  },
})
export class ToggleIconDirective {
  @HostBinding('class.is-toggled')
  @Input()
  toggled: boolean;

  toggle(force?: boolean) {
    this.toggled = typeof force === 'boolean' ? force : !this.toggled;
  }
}
