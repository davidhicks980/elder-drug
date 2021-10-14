import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export enum PopupActions {
  close,
  preventClose,
  allowClose,
  open,
  preventOpen,
  allowOpen,
  destroy,
}
export type PlaceholderDetails = {
  text: string;
  itemCount: number;
};

@Injectable()
export class PopupService {
  actionSource = new BehaviorSubject(PopupActions.allowOpen);
  actions$ = this.actionSource.asObservable();
  keyDownSource = new Subject();
  keyDown$ = this.keyDownSource.asObservable();

  emitKeydown(keypress: KeyboardEvent) {
    this.keyDownSource.next(keypress);
  }
  emitAction(action: PopupActions) {
    this.actionSource.next(action);
  }

  constructor() {}
}
