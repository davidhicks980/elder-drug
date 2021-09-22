import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { PopupService } from '../../../../services/popup.service';

@Component({
  selector: 'popup-placeholder',
  templateUrl: './popup-placeholder.component.html',
  styleUrls: ['./popup-placeholder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupContentComponent {
  private placeholderList_: string[];
  private emptyPlaceholder_ = 'Drug Name';
  private placeholderSource = new BehaviorSubject(this.emptyPlaceholder_);
  placeholder$ = this.placeholderSource.asObservable();
  private lengthSource = new BehaviorSubject(0);
  length$ = this.lengthSource.asObservable();
  @Input()
  get placeholderList(): string[] {
    return this.placeholderList_;
  }
  set placeholderList(value: string[]) {
    if (value?.length) {
      this.placeholderList_ = value;
      this.placeholderSource.next(value[0]);
      this.lengthSource.next(value.length);
    } else {
      this.lengthSource.next(0);
    }
  }
  @Input()
  get emptyPlaceholder(): string {
    return this.emptyPlaceholder_;
  }
  set emptyPlaceholder(value: string) {
    this.emptyPlaceholder_ = value;
  }

  constructor(private popupService: PopupService) {
    popupService.placeholder$.subscribe((details) => {
      this.placeholderSource.next(details.text);
      this.lengthSource.next(details.itemCount);
    });
  }
}
