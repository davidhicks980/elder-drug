import { Directive } from '@angular/core';
import { TemplateContentDirective } from '../../../directives/content-template.directive';

@Directive({ selector: '[elder-toolbar-toggle]' })
export class ToolbarToggleDirective extends TemplateContentDirective {}
