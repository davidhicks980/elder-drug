import {
  AfterViewInit,
  ChangeDetectorRef,
  ContentChildren,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  QueryList,
  Renderer2,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Keys } from '../constants/keys.constants';
import { debounceOnMicrotask } from '../functions/debounce';
import { KeyGridService } from '../services/key-grid.service';

function focusableItemPredicate(el: HTMLElement) {
  const isDisabledOrHidden =
    el.getAttribute('aria-disabled') === 'true' ||
    el.getAttribute('disabled') != null ||
    el.getAttribute('hidden') != null ||
    el.getAttribute('aria-hidden') === 'true';
  const isVisible = el.tabIndex >= 0 && el.getBoundingClientRect().width > 0 && !isDisabledOrHidden;

  let isProgrammaticallyHidden = false;
  if (isVisible) {
    const style = getComputedStyle(el);
    isProgrammaticallyHidden = style.display === 'none' || style.visibility === 'hidden';
  }
  return isVisible && !isProgrammaticallyHidden;
}

@Directive({
  selector: '[data-emit-keys], [keyEmitter]',
})
export class KeyGridDirective implements AfterViewInit, OnDestroy {
  readonly nonce: string = '';
  private column_: number;
  private row_: number;
  updatePosition: () => void;
  awaitFocus: Promise<boolean>;
  /**
   * Name of the keyEmitter element. Useful if you wish to filter directives using @ViewChild, but not necessary.
   *
   * @type {string}
   * @memberof KeyGridDirective
   */
  @Input('keyEmitter')
  name: string;
  @Input()
  set tabIndex(tabIndex: number) {
    this.renderer.setProperty(this.element, 'tabIndex', tabIndex);
  }
  get tabIndex() {
    return this.element.tabIndex;
  }
  @Input('keyColumn')
  get column(): number {
    return this.column_;
  }
  set column(value: number) {
    if (value != this.column_) {
      this.column_ = value;
      this.updatePosition();
    }
  }
  /**
   * Row that the cell inhabits. Used when querying cells.
   *
   * @type {number}
   * @memberof KeyGridDirective
   */
  @Input('keyRow')
  get row(): number {
    return this.row_;
  }
  set row(value: number) {
    if (value != this.row_) {
      this.row_ = value;
      this.updatePosition();
    }
  }
  focusElement() {
    this.keyGridService.enable();
    this.updatePosition();

    this.keyGridService.focusCell(this.nonce);
  }

  get element(): HTMLElement {
    return this.host?.nativeElement;
  }
  constructor(
    private host: ElementRef,
    private keyGridService: KeyGridService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
    this.nonce = this.createGridNonce();
    //Debounce to prevent duplicate update calls
    this.updatePosition = debounceOnMicrotask(() => {
      this.keyGridService.updateCell(this.nonce, this.row_, this.column_);
    });
  }
  ngAfterViewInit() {
    this.keyGridService.updateCell(this.nonce, this.row_, this.column_);
    this.keyGridService.focusedElement$.subscribe(this.updateGridFocus.bind(this));
    this.tabIndex = this.keyGridService.focusedCell === this.nonce ? 0 : -1;
  }

  ngOnDestroy() {
    this.keyGridService.deleteCell(this.nonce);
  }

  private focus() {
    this.element.focus();
  }
  private updateGridFocus(nonce: string) {
    if (nonce === this.nonce) {
      this.tabIndex = 0;
      if (this.keyGridService.enabled) {
        this.focus();
      }
    } else {
      this.tabIndex = -1;
    }
    Promise.resolve(this.awaitFocus);
  }

  private createGridNonce() {
    return `${Math.floor(Math.random() * 9999999)}`;
  }
}

function isToggleKey(key: string) {
  return Keys.ENTER === key || Keys.SPACEBAR.includes(key);
}
function isNavigationKey(key: string) {
  return Keys.ARROWS.includes(key) || key === 'End' || key === 'Home';
}
const focusableTags = '[autofocus], [tabindex], a, input, textarea, select, button';
@Directive({
  selector: '[data-key-observer], [keyObserver]',
  providers: [KeyGridService],
})
export class KeyObserverDirective implements OnDestroy {
  @ContentChildren(KeyGridDirective, { descendants: true })
  gridItems: QueryList<KeyGridDirective>;
  @HostBinding('attr.tabindex')
  @Input()
  tabindex: string = '0';
  private keyStream$: Observable<Event> | undefined = undefined;
  private keyStreamSubscription: Subscription;
  @Input()
  set keyObserver(value: Observable<Event>) {
    this.keyStream$ = value;
    this.initializeKeyStream(value);
  }
  get keyObserver(): Observable<Event> {
    return this.keyStream$;
  }
  @HostListener('keydown', ['$event'])
  handleKeydown($event: KeyboardEvent) {
    if (!this.keyStream$) {
      this.handleKeys($event);
    }
  }
  @HostListener('focus')
  handleFocus() {
    if (this.canFocusIn) {
      this.canFocusIn = false;
      this.focusFirstChild();
    }
  }
  get element() {
    return this.host.nativeElement as HTMLElement;
  }
  destroyFocusListener: () => void;
  canFocusIn: boolean = true;

  private initializeKeyStream(stream: Observable<Event>) {
    this.keyStreamSubscription?.unsubscribe();
    if (stream) {
      this.keyStreamSubscription = stream.subscribe(this.handleKeys.bind(this));
    }
  }
  private handleKeys($event: KeyboardEvent) {
    let { key } = $event;
    let navigating = isNavigationKey(key);
    let toggle = isToggleKey(key);
    if (navigating || toggle) {
      if (navigating) {
        $event.preventDefault();
        this.keyService.enable();
      }
      this.keyService.handleKeyPress($event.key, $event.ctrlKey);
    }
    if (Keys.TAB === key || Keys.ESCAPE.includes(key)) {
      this.keyService.disable();
    }
  }
  private focusFirstChild() {
    const focusableEls = [].slice.call(
      this.element.querySelectorAll(focusableTags)
    ) as HTMLElement[];
    if (focusableEls?.length) {
      let element = focusableEls.filter(focusableItemPredicate)[0];
      if (element && !this.gridItems.some((item) => item.element.isEqualNode(element))) {
        element.focus();
      } else {
        this.gridItems.first?.focusElement();
      }

      this.destroyFocusListener = this.renderer.listen(this.element, 'focus', (e: FocusEvent) => {
        if (!this.element.contains(e.target as Node)) {
          this.destroyFocusListener();
          this.canFocusIn = true;
        }
      });
    } else {
      this.canFocusIn = true;
    }
  }

  ngOnDestroy() {
    this.keyStreamSubscription?.unsubscribe();
    if (this.destroyFocusListener) this.destroyFocusListener();
  }

  constructor(
    private host: ElementRef,
    private keyService: KeyGridService,
    private renderer: Renderer2
  ) {}
}
