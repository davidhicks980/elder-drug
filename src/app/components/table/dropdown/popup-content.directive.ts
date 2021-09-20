import { Directive } from '@angular/core';

import { TemplateContentDirective } from '../../../directives/content-template.directive';

@Directive({
  selector: '[popup-content]',
})
export class PopupContentDirective extends TemplateContentDirective {}
