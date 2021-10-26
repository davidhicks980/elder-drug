import {
  ContentChild,
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { ToggleIconDirective } from '../components/menu-toggle/toggle-icon.directive';

@Directive({
  selector: '[elderIconButton]',
})
export class IconButtonDirective {
  private _toggled: boolean;
  @ContentChild(ToggleIconDirective)
  slottedIcon: ToggleIconDirective;
  @Output()
  toggle: EventEmitter<boolean> = new EventEmitter();
  @Input()
  toggleLabel: string = 'Open';
  @Input()
  untoggleLabel: string = 'Close';
  @Input()
  get toggled() {
    return this._toggled;
  }
  set toggled(value: boolean) {
    this._toggled = value;
    this.slottedIcon?.toggle(value);
  }
  @HostBinding('attr.aria-label') get label() {
    return this.toggled ? this.untoggleLabel : this.toggleLabel;
  }
  @HostBinding('style')
  get styles() {
    return `
:host {
  --icon-button--size: 32px;
  --icon-button--color: #{pal.$gray-4};
  --icon-button--active-color: #{pal.$primary-3};
  --icon-button--outline-color: #{color.scale(pal.$primary-1, $alpha: -50%)};
  --icon-button--background-color: transparent;
  --icon-button--shadow: #{pal.shadow(2, false, 20%)};
  --icon-button--ring-opacity: 0;
  outline: none;
  scroll-behavior: none;
}
button {
  background: none;
  border: none;
  display: block;
  line-height: 0px;
  outline: none;
  padding: 0;
  position: relative;
  color: var(--icon-button--color);
  height: var(--icon-button--size);
  width: var(--icon-button--size);
  -webkit-tap-highlight-color: transparent;
  z-index: 10;
  &::before {
    border-radius: 50%;
    transform-origin: center;
    box-sizing: border-box;
    content: "";
    display: block;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    opacity: var(--icon-button--ring-opacity);
    position: absolute;
    transform: scale(1.35);
    transition: transform 250ms cubic-bezier(0.175, 0.885, 0.32, 1),
      opacity 400ms cubic-bezier(0.175, 0.885, 0.32, 1);
    outline: 1px solid var(--icon-button--outline-color);
    background-color: var(--icon-button--background-color);
    box-shadow: var(--icon-button--shadow);
  }

  &:hover,
  &:focus {
    color: var(--icon-button--active-color);
    --icon-button--ring-opacity: 1;
  }
  &:active {
    --icon-button--ring-opacity: 0.7;
    &::before {
      transform: scale(1.55);
    }
  }
}


    `;
  }
  @HostListener('click', ['$event'])
  handleClick($event: MouseEvent) {
    this.toggle.emit(this.toggled);
  }
  ngAfterViewInit() {
    this.slottedIcon.toggle(this._toggled);
  }
}
