import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'elder-animated-x',
  templateUrl: './animated-x.component.svg',
  styleUrls: ['./animated-x.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimatedXComponent {}
