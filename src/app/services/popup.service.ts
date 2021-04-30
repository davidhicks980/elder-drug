import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

export enum PopupActions {
  close, preventClose,allowClose, open, preventOpen, allowOpen, destroy
}
@Injectable({
  providedIn: 'root',
})
export class PopupService {
  popupActionStream = new Subject();
  popupAction$ = this.popupActionStream.asObservable();
  triggerPopup(action: PopupActions){
    this.popupActionStream.next(action)
  }
  
  constructor() {}
}
