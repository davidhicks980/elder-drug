import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[highlightMatch]',
})
export class HighlightMatchDirective {
  private _highlightMatch;
  @Input()
  get highlightMatch() {
    return this._highlightMatch;
  }
  set highlightMatch(value) {
    let openTag = RegExp('◬hl◬', 'gi'),
      closeTag = RegExp('◬hle◬', 'gi');
    if (openTag.test(value.toLowerCase())) {
      let html = this.elementRef.nativeElement.innerHTML;
      let out = html.replace(openTag, '<span class="highlight">').replace(closeTag, '</span>');
      console.log(out);
      this.r2.setProperty(this.elementRef.nativeElement, 'innerHTML', out);
    }
  }
  constructor(private elementRef: ElementRef, private r2: Renderer2) {}
}
