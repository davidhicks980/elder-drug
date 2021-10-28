import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'elder-animated-arrow',
  templateUrl: './animated-arrow.component.svg',
  styleUrls: ['./animated-arrow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimatedArrowComponent {
  @HostBinding('class.left-arrow') @Input() toLeft: boolean = true;
}
