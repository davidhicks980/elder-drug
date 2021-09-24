import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { timer } from 'rxjs';

import { ToggleIconDirective } from './toggle-icon.directive';

@Component({
  selector: 'elder-menu-toggle',
  templateUrl: './menu-toggle.component.html',
  styleUrls: ['./menu-toggle.component.scss'],
})
export class MenuToggleComponent implements AfterViewInit {
  @ContentChild(ToggleIconDirective, { read: ElementRef })
  slottedContent: ElementRef;
  @Output()
  toggle: EventEmitter<boolean> = new EventEmitter();
  private _toggled: boolean = false;
  @Input()
  public get toggled(): boolean {
    return this._toggled;
  }
  public set toggled(value: boolean) {
    this._toggled = value;
    this.toggleIconClass();
  }
  toggleIconClass() {
    if (this.slottedContent) {
      let { nativeElement } = this.slottedContent;
      if (this._toggled) {
        requestAnimationFrame(() => {
          this.renderer.addClass(nativeElement, 'is-toggled');
        });
      } else {
        timer(100)
          .toPromise()
          .then(() => {
            this.renderer.removeClass(nativeElement, 'is-toggled');
          });
      }
    }
  }

  @HostBinding('attr.aria-label') get label() {
    return this.toggled ? 'Close search drawer' : 'Open search drawer';
  }
  @HostBinding('class.is-toggled') get toggleState() {
    return this.toggled;
  }
  @HostListener('click', ['$event']) handleClick($event: MouseEvent) {
    this.toggled = !this.toggled;
    this.toggle.emit(this.toggled);
  }

  ngAfterViewInit() {
    this.toggleIconClass();
  }
  constructor(private renderer: Renderer2) {}
}