import { Directive } from '@angular/core';

import { TemplateContentDirective } from '../../../directives/content-template.directive';

@Directive({
  selector: '[sidebar-brand]',
})
export class SidebarBrandDirective extends TemplateContentDirective {}
@Directive({
  selector: '[sidebar-toggle]',
})
export class SidebarToggleDirective extends TemplateContentDirective {}
