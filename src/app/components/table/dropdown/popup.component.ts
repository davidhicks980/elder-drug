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
import { nextTick } from 'process';
import { Subject } from 'rxjs';
import { filter, skipWhile, takeUntil, tap } from 'rxjs/operators';
import { PopupActions, PopupService } from '../../../services/popup.service';

@Component({
  selector: 'elder-popup',
  template: `
    <label for="popup-trigger">{{ label }}</label>
    <div class="popup-wrapper">
      <button
        matTooltip="{{ selectedOptions | join | caseSplit }}"
        #trigger
        (click)="attach()"
        class="popup-trigger"
        role="listbox"
        name="popup-trigger"
      >
        <span *ngIf="selectedOptions" class="popup-trigger__label">
          {{ selectedOptions[0] + ', ' + selectedOptions[1] || '' }}
          <span *ngIf="selectedOptions.length > 1" class="additional-selection">
            (+{{ selectedOptions.length - 1 }}
            {{ selectedOptions.length === 2 ? 'other' : 'others' }})
          </span>
        </span>
        <svg
          class="popup-trigger__arrow"
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          [class.is-rotated]="component?.hasAttached()"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M7 10l5 5 5-5H7z" />
        </svg>
      </button>
    </div>

    <div #anchor></div>
    <ng-template id="anchor" #templatePortalContent>
      <ng-content selector="popup-content"></ng-content>
    </ng-template>
  `,
  styleUrls: [`popup.component.scss`],
})
export class PopupComponent implements AfterViewInit, OnDestroy {
  @ViewChild('templatePortalContent') template: TemplateRef<unknown>;
  @ViewChild('anchor') anchor: ElementRef;
  @ViewChild('trigger') trigger: ElementRef;

  @Input() selectedOptions: string[] = [''];
  @Input() label = 'Select from the options below';
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
  ngAfterViewInit() {
    this.initPopup();
    this.component.attach(this.portal);
    const trigger = this.trigger.nativeElement as HTMLElement;
    this.component
      .outsidePointerEvents()
      .pipe(
        filter(
          (e) => !trigger.contains(e.target as Element) && this.allowClicks
        ),
        takeUntil(this.destroyedObserver),
      )
      .subscribe((e) => {
        this.component.detach()});

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
          break;
        case PopupActions.open:
          this.component.attach(this.portal)
          break;
        case PopupActions.allowOpen:
          break;
        case PopupActions.destroy:
          throw Error('action not implemented');
          break;
        default:
          return ;
      }
    });
  }

  initPopup() {
    this.portal = new TemplatePortal(this.template, this.view);
    this.component = this.createOverlay(this.anchor);
    this.observeKeydown(this.component);
  }
  attach() {
    this.component.hasAttached()
      ? this.component.detach()
      : this.component.attach(this.portal);
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
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
  }
}
