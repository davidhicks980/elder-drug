import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { matMenuAnimations } from '@angular/material/menu';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { PopupActions, PopupService } from '../../../services/popup.service';
import { PopupContentDirective } from './popup-content.directive';

@Component({
  selector: 'elder-popup',
  templateUrl: `popup.component.html`,
  styleUrls: [`popup.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [matMenuAnimations.transformMenu],
  providers: [PopupService],
})
export class PopupComponent implements AfterViewInit, OnDestroy {
  @ViewChild('templatePortalContent') template: TemplateRef<unknown>;
  @ViewChild('anchor') anchor: ElementRef;
  @ViewChild('trigger') trigger: ElementRef;
  @ContentChild(PopupContentDirective) content: PopupContentDirective;
  @Input() selectedOptions: string[] = [''];
  @Input() ignoreClicks;
  component: OverlayRef | null;
  portal: TemplatePortal<unknown>;
  private destroySubject = new Subject();
  private destroyedObserver = this.destroySubject.asObservable();
  allowClicks: boolean = true;
  attached = new BehaviorSubject(false);

  get attached$() {
    return this.attached.asObservable();
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
        filter(({ target }) => {
          return !trigger.contains(target as Element) && this.allowClicks;
        }),
        takeUntil(this.destroyedObserver)
      )
      .subscribe(() => this.component.detach());
  }
  listenForPortalActions() {
    this.popupService.actions$.subscribe((action) => {
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
    this.component = this.createOverlay(this.trigger);
    this.observeKeydown(this.component);
  }
  attachPopup() {
    this.attached.next(true);
    return this.component.hasAttached()
      ? null
      : this.component.attach(this.portal);
  }
  togglePopup() {
    if (this.component.hasAttached()) {
      this.component.detach();
      this.attached.next(false);
    } else {
      this.component.attach(this.portal);
      this.attached.next(true);
    }
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

  private createOverlay(anchor: ElementRef<HTMLElement>) {
    return this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(anchor)
        .withPositions([
          {
            originX: 'center',
            originY: 'center',
            overlayX: 'center',
            overlayY: 'center',
          },
        ])
        .withPush(true),
      disposeOnNavigation: true,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
  }
}
