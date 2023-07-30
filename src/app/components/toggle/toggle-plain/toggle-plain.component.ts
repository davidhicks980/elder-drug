import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  HostBinding,
  Input,
} from '@angular/core';
import { ToggleIconDirective } from '../toggle-icon.directive';

@Component({
  selector: 'a[elder-icon-button], button[elder-icon-button]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./toggle-plain.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'elder-toggle',
  },
})
export class ElderIconButtonComponent {
  @ContentChild(ToggleIconDirective)
  slottedIcon: ToggleIconDirective;
  @HostBinding('style.--icon-button--width') @Input() width: string = '42px';
  @HostBinding('style.--icon-button--height') @Input() height: string = '42px';
  @HostBinding('style.--icon-button--icon-scale') @Input() iconScale: string = '0.6';
}
