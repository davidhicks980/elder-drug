import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'elder-button',
  templateUrl: './text-icon-button.component.html',
  styleUrls: ['./text-icon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextIconButtonComponent {
  @Input() toggled: boolean = false;
  @Output() toggle: EventEmitter<boolean> = new EventEmitter();
  @HostBinding('attr.tabindex') get tabIndex() {
    return '0';
  }
  @HostBinding('attr.aria-pressed') get ariaPressed() {
    return this.toggled ? 'true' : 'false';
  }
  @HostListener('click') onClick() {
    this.handleToggle();
  }
  @HostListener('keydown.enter') onEnter() {
    this.handleToggle();
  }
  @HostListener('keyup.space') onSpace() {
    this.handleToggle();
  }
  handleToggle() {
    this.toggled = !this.toggled;
    this.toggle.emit(this.toggled);
  }
  constructor() {}
}
