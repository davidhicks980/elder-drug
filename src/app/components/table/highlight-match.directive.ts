import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

import { HIGHLIGHT_REGEX, HIGHLIGHT_START } from './BeersTableDataSource';

@Directive({
  selector: '[highlight]',
})
export class HighlightMatchDirective {
  element: HTMLElement;
  private highlightText;
  @Input()
  get highlight() {
    return this.highlightText;
  }
  set highlight(value: string) {
    this.highlightText = value;
    this.element = this.elementRef.nativeElement;
    this.createHighlightNodes();
  }

  appendText(text: string) {
    return this.r2.createText(text);
  }
  appendHighlightedText(text: string) {
    return this.r2.appendChild(
      this.elementRef.nativeElement,
      this.r2.setProperty(this.r2.createElement('span') as HTMLSpanElement, 'textContent', text)
    );
  }
  createHighlightNodes() {
    if (this.element) {
      let text = this.element.textContent;
      console.log(text);
      if (text.includes(HIGHLIGHT_START)) {
        this.r2.setProperty(this.element, 'textContent', '');
        let start = text.startsWith(HIGHLIGHT_START),
          content = text.split(HIGHLIGHT_REGEX);
        console.log(content);

        content.forEach((fragment, index) => {
          const highlight = start && index % 2 === 0;
          if (highlight) {
            this.appendHighlightedText(fragment);
          } else {
            this.appendText(fragment);
          }
        });
      }
    }
  }
  constructor(private elementRef: ElementRef, private r2: Renderer2) {
    this.createHighlightNodes();
  }
}
