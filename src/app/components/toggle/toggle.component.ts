import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { timer } from 'rxjs';

import { ToggleIconDirective } from './toggle-icon.directive';

@Component({
  selector: 'a[elder-toggle], button[elder-toggle]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'elder-toggle',
  },
})
export class ToggleComponent implements AfterViewInit {
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
  @HostBinding('style.--icon-button--size') @Input() diameter: string = '42px';
  @HostBinding('style.--icon-button--icon-scale') @Input() iconScale: string = '0.6';
  @HostListener('click', ['$event'])
  handleClick($event: MouseEvent) {
    this.toggle.emit(this.toggled);
  }
  ngAfterViewInit() {
    this.slottedIcon.toggle(this._toggled);
  }
}
