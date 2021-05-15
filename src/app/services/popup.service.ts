import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum PopupActions {
  close,
  preventClose,
  allowClose,
  open,
  preventOpen,
  allowOpen,
  destroy,
}
@Injectable({
  providedIn: 'root',
})
export class PopupService {
  popupActionStream = new Subject();
  popupAction$ = this.popupActionStream.asObservable();
  popupKeydownStream = new Subject();
  popupKeyPresses$ = this.popupKeydownStream.asObservable();
  emitKeydown(keypress: KeyboardEvent) {
    this.popupKeydownStream.next(keypress);
  }
  triggerPopup(action: PopupActions) {
    this.popupActionStream.next(action);
  }

  constructor() {}
}
