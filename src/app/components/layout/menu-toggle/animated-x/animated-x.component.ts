import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { ToggleIcon } from '../ToggleAnimation';

@Component({
  selector: 'elder-animated-x',
  templateUrl: './animated-x.component.svg',
  styleUrls: ['./animated-x.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ToggleIcon, useValue: true }],
})
export class AnimatedXComponent {
  constructor(@Inject(ToggleIcon) token: boolean) {}
}
