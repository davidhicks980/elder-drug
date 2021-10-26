import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'autocomplete-content',
  templateUrl: './autocomplete-content.component.html',
  styleUrls: ['./autocomplete-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteContentComponent {
  @Input() type: '~g' | '~b' = '~g';
  @Input() hideChips: boolean = false;
  @HostBinding('class.chips-hidden')
  get chipsHidden() {
    return this.hideChips;
  }
}
