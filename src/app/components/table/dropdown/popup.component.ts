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
import { filter } from 'rxjs/operators';

import { destroy } from '../../../services/destroy';
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
  destroy$ = new Subject();
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
    this.destroy$.next(true);
    this.component.detach();
    this.component.dispose();
  }
  listenForPointerEvents() {
    const trigger = this.trigger.nativeElement as HTMLElement;
    this.component
      .outsidePointerEvents()
      .pipe(
        destroy(this),
        filter(({ target }) => {
          return !trigger.contains(target as Element) && this.allowClicks;
        })
      )
      .subscribe(() => this.togglePopup(false));
  }
  listenForPortalActions() {
    this.popupService.actions$.subscribe((action) => {
      switch (action) {
        case PopupActions.preventClose:
          this.allowClicks = false;
          break;
        case PopupActions.close:
          this.togglePopup(false);
          break;
        case PopupActions.allowClose:
          this.allowClicks = true;
          break;
        case PopupActions.preventOpen:
          throw Error('action not implemented');
        case PopupActions.open:
          this.togglePopup(true);
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

  togglePopup(force?: boolean) {
    if (this.component.hasAttached() || force === false) {
      this.attached.next(false);
      this.component.detach();
    } else {
      this.attached.next(true);
      this.component.attach(this.portal);
    }
  }
  observeKeydown(component: OverlayRef) {
    component
      .keydownEvents()
      .pipe(destroy(this))
      .subscribe((event) => {
        switch (event.code) {
          case 'Enter':
            break;
          case 'Escape':
            this.togglePopup(false);
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
