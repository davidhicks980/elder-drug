import { InjectionToken } from '@angular/core';

export interface ToolbarTokens {
  TOGGLE_TEMPLATE: Symbol;
}
export const toolbarTokens = {
  TOGGLE_TEMPLATE: Symbol('TOGGLE_TEMPLATE_TOKEN'),
};

export const TOOLBAR_TOKENS = new InjectionToken<ToolbarTokens>(
  'toolbar.TOKENS'
);
