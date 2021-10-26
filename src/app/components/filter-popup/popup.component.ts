import {
  FlexibleConnectedPositionStrategy,
  GlobalPositionStrategy,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { matMenuAnimations } from '@angular/material/menu';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { destroy } from '../../functions/destroy';
import { LayoutService } from '../../services/layout.service';
import { PopupActions, PopupService } from '../../services/popup.service';
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
  private fullScreenOverlay: boolean = false;
  @ViewChild('portalContent') template: TemplateRef<unknown>;
  @ViewChild('anchor') anchor: ElementRef;
  @ViewChild('trigger') trigger: ElementRef;
  @Input() icon = '';
  @ContentChild(PopupContentDirective) content: PopupContentDirective;
  @Input() selectedOptions: string[] = [''];
  @Input() tooltipText = '';
  private positionStrategies: {
    global: GlobalPositionStrategy;
    attached: FlexibleConnectedPositionStrategy;
  };
  @Input()
  get centered(): boolean {
    return this.fullScreenOverlay;
  }
  set centered(value: boolean) {
    if (this.fullScreenOverlay != value) {
      this.fullScreenOverlay = value;
      if (this.component) {
        this.component.updatePositionStrategy(
          value ? this.positionStrategies.global : this.positionStrategies.attached
        );
        if (!value) {
          this.component.detachBackdrop();
        }
      }
    }
  }
  private component: OverlayRef | null;
  private portal: TemplatePortal<unknown>;
  private allowClicks: boolean = true;
  private attachedSource = new BehaviorSubject(false);
  destroy$ = new Subject();
  attached$ = this.attachedSource.asObservable();

  constructor(
    private overlayService: Overlay,
    private viewRef: ViewContainerRef,
    private popupService: PopupService,
    public layoutService: LayoutService,
    private element: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnDestroy() {
    this.destroy$.next(true);
    this.component.detach();
    this.component.dispose();
  }
  listenForPointerEvents() {
    let { nativeElement } = this.element as ElementRef<HTMLElement>;
    this.component
      .outsidePointerEvents()
      .pipe(
        destroy(this),
        filter(({ target }) => !nativeElement.contains(target as Element) && this.allowClicks)
      )
      .subscribe(() => this.togglePopup(false));
  }
  listenForPortalActions() {
    this.popupService.actions$.pipe(destroy(this)).subscribe((action) => {
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

        case PopupActions.destroy:
          throw Error('action not implemented');
        default:
          return;
      }
    });
  }
  ngAfterViewInit() {
    this.positionStrategies = this.buildPositionStrategies(this.anchor);
    this.initPopup();
    this.listenForPointerEvents();
    this.listenForPortalActions();
  }
  private buildPositionStrategies(anchor: ElementRef<HTMLElement>) {
    return {
      global: this.overlayService.position().global().centerHorizontally().centerVertically(),
      attached: this.overlayService
        .position()
        .flexibleConnectedTo(anchor)
        .withGrowAfterOpen(false)
        .withViewportMargin(10)
        .withPositions([
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
          },
        ])
        .withPush(true),
    };
  }
  private initPopup() {
    this.portal = new TemplatePortal(this.template, this.viewRef);
    this.component = this.createOverlay();
    this.component
      .keydownEvents()
      .pipe(destroy(this))
      .subscribe((event) => (event.code === 'Escape' ? this.togglePopup(false) : ''));
  }

  togglePopup(force?: boolean) {
    if (this.component.hasAttached() || force === false) {
      this.attachedSource.next(false);
      this.component.detach();
    } else {
      this.attachedSource.next(true);
      this.component.attach(this.portal);
    }
  }

  private createOverlay() {
    return this.overlayService.create({
      positionStrategy: this.fullScreenOverlay
        ? this.positionStrategies.global
        : this.positionStrategies.attached,
      hasBackdrop: this.fullScreenOverlay,
      disposeOnNavigation: true,
      scrollStrategy: this.overlayService.scrollStrategies.reposition({ scrollThrottle: 30 }),
    });
  }
}
