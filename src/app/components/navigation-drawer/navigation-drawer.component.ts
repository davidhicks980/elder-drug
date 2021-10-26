import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'elder-navigation-drawer',
  templateUrl: './navigation-drawer.component.html',
  styleUrls: ['./navigation-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationDrawerComponent {
  @HostBinding('class.backdrop')
  @Input()
  open: boolean = false;
  @Output() toggle = new EventEmitter();
  emitToggle() {
    this.toggle.emit(false);
  }
}
