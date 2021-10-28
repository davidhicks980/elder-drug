import { Directive } from '@angular/core';

import { TemplateContentDirective } from '../../directives/content-template.directive';

@Directive({
  selector: '[search-drawer-brand]',
})
export class SearchDrawerBrandDirective extends TemplateContentDirective {}
@Directive({
  selector: '[search-drawer-toggle]',
})
export class SearchDrawerToggleDirective extends TemplateContentDirective {}
