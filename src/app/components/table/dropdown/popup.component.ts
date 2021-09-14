import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { PopupActions, PopupService } from '../../../services/popup.service';

@Component({
  selector: 'elder-popup',
  templateUrl: `popup.component.html`,
  styleUrls: [`popup.component.scss`],
})
export class PopupComponent implements AfterViewInit, OnDestroy {
  @ViewChild('templatePortalContent') template: TemplateRef<unknown>;
  @ViewChild('anchor') anchor: ElementRef;
  @ViewChild('trigger') trigger: ElementRef;
  @Input() selectedOptions: string[] = [''];
  @Input() ignoreClicks;
  component: OverlayRef | null;
  portal: TemplatePortal<unknown>;
  private destroySubject = new Subject();
  private destroyedObserver = this.destroySubject.asObservable();
  attached: boolean = false;
  prevClose: boolean;
  allowClicks: boolean = true;
  click(e) {
    console.log(e);
  }
  constructor(
    private overlay: Overlay,
    private view: ViewContainerRef,
    private popupService: PopupService
  ) {}
  ngOnDestroy() {
    this.destroySubject.next(true);
    this.component.detach();
    this.component.dispose();
  }
  listenForPointerEvents() {
    const trigger = this.trigger.nativeElement as HTMLElement;

    this.component
      .outsidePointerEvents()
      .pipe(
        filter(
          (e) => !trigger.contains(e.target as Element) && this.allowClicks
        ),
        takeUntil(this.destroyedObserver)
      )
      .subscribe(() => this.component.detach());
  }
  listenForPortalActions() {
    this.popupService.popupAction$.subscribe((action) => {
      switch (action) {
        case PopupActions.preventClose:
          this.allowClicks = false;
          break;
        case PopupActions.close:
          this.component.detach();
          break;
        case PopupActions.allowClose:
          this.allowClicks = true;
          break;
        case PopupActions.preventOpen:
          throw Error('action not implemented');
        case PopupActions.open:
          this.attachPopup();
          break;
        case PopupActions.allowOpen:
          break;
        case PopupActions.destroy:
          throw Error('action not implemented');
        default:
          return;
      }
    });
  }
  ngAfterViewInit() {
    this.initPopup();
    this.listenForPointerEvents();
    this.listenForPortalActions();
  }

  initPopup() {
    this.portal = new TemplatePortal(this.template, this.view);
    this.component = this.createOverlay(this.anchor);
    this.observeKeydown(this.component);
  }
  attachPopup() {
    return this.component.hasAttached()
      ? null
      : this.component.attach(this.portal);
  }
  togglePopup() {
    this.component.hasAttached()
      ? this.component.detach()
      : this.component.attach(this.portal);
    this.component.hostElement.onclose;
  }
  observeKeydown(component: OverlayRef) {
    component
      .keydownEvents()
      .pipe(takeUntil(this.destroyedObserver))
      .subscribe((event) => {
        switch (event.code) {
          case 'Enter':
            break;
          case 'Escape':
            this.component.detach();
            break;
          case 'Tab':
            break;
          default:
            null;
        }
      });
  }

  private createOverlay(anchor: any) {
    return this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(anchor)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
        ]),
      disposeOnNavigation: true,
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
  }
}
