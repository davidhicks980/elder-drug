import { InjectionToken } from '@angular/core';

export interface SidebarTokens {
  BRAND_TEMPLATE: Symbol;
  TOGGLE_TEMPLATE: Symbol;
}
export const sidebarTokens: SidebarTokens = {
  BRAND_TEMPLATE: Symbol('BRAND_TEMPLATE'),
  TOGGLE_TEMPLATE: Symbol('TOGGLE_TEMPLATE'),
};
export const SIDEBAR_TOKEN = new InjectionToken<SidebarTokens>(
  'sidebar.TOKENS'
);
