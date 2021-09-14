import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'elder-animated-arrow',
  templateUrl: './animated-arrow.component.svg',
  styleUrls: ['./animated-arrow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimatedArrowComponent {
  @Input() direction: 'LEFT' | 'RIGHT' = 'RIGHT';
  @Input() toggled: boolean = false;
  constructor() {}
}
