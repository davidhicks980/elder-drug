import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { initializeApp } from 'firebase/app';

import { environment } from '../environments/environment';
import { ElderRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrandComponent } from './components/brand/brand.component';
import { VerticalComponent } from './components/brand/vertical/vertical.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { GradientIconComponent } from './components/icon/icon.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AnimatedArrowComponent } from './components/layout/menu-toggle/animated-arrow/animated-arrow.component';
import { AnimatedXComponent } from './components/layout/menu-toggle/animated-x/animated-x.component';
import { MenuToggleComponent } from './components/layout/menu-toggle/menu-toggle.component';
import { ToggleIconDirective } from './components/layout/menu-toggle/toggle-icon.directive';
import { DrugFormComponent } from './components/layout/side-navigation/drug-form/drug-form.component';
import {
  SearchButtonsComponent,
} from './components/layout/side-navigation/drug-form/search-buttons/search-buttons.component';
import {
  AutocompleteContentComponent,
} from './components/layout/side-navigation/drug-form/typeahead/autocomplete-content.component';
import { SidebarBrandDirective, SidebarToggleDirective } from './components/layout/side-navigation/sidebar-brand.directive';
import { SidebarComponent } from './components/layout/side-navigation/sidebar.component';
import {
  AboutComponent,
  DesignComponent,
  DisclaimerComponent,
  ToolbarComponent,
} from './components/layout/top-toolbar/toolbar.component';
import { TabLinkComponent } from './components/tab/tab-link/tab-link.component';
import { TabComponent } from './components/tab/tab.component';
import { CellComponent } from './components/table/cell/cell.component';
import { ExpandToggleDirective } from './components/table/directives/expand-toggle.directive';
import { ColumnSelectorComponent } from './components/table/dropdown/column-selector/column-selector.component';
import { DropItemComponent } from './components/table/dropdown/group-by/button/drop-item.component';
import { GroupByComponent } from './components/table/dropdown/group-by/group-by.component';
import { PopupContentDirective } from './components/table/dropdown/popup-content.directive';
import { PopupContentComponent } from './components/table/dropdown/popup-content/popup-placeholder.component';
import { PopupComponent } from './components/table/dropdown/popup.component';
import { EntryRangeCardComponent } from './components/table/entry-range-card/entry-range-card.component';
import { ExpandedElementComponent } from './components/table/expanded-element/expanded-element.component';
import { ExpandedRowCardComponent } from './components/table/expanded-row-card/entry-card.component';
import { FilterInputComponent } from './components/table/filter-input/filter-input.component';
import { GroupRowComponent } from './components/table/group-row/group-row.component';
import { HighlightPipe } from './components/table/highlight.pipe';
import { SafeHtmlPipe } from './components/table/safe-html.pipe';
import { TableCardComponent } from './components/table/table-card/table-card.component';
import { FilterBarComponent } from './components/table/table-filter-bar/filter-bar.component';
import { TableComponent } from './components/table/table.component';
import { TextIconButtonComponent } from './components/text-icon-button/text-icon-button.component';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { CellPaddingDirective } from './directives/cell-padding.directive';
import { TemplateContentDirective } from './directives/content-template.directive';
import { CreationSpyDirective } from './directives/creation-spy.directive';
import { ExpandableRowDirective } from './directives/expandable-row.directive';
import { IconButtonDirective } from './directives/icon-button.directive';
import { KeyGridDirective } from './directives/keygrid.directive';
import { ListKeyDirective } from './directives/list-key.directive';
import { RippleDirective } from './directives/ripple.directive';
import { RotateDirective } from './directives/rotate-icon.directive';
import { RowToggleDirective } from './directives/row-toggle.directive';
import { SvgGradientDirective } from './directives/svg-gradient.directive';
import { TrackingGradientDirective } from './directives/tracking-gradient.directive';
import { LetDirective } from './directives/with.directive';
import { BEERS_ENTRIES, beersEntries } from './injectables/brand-drugs.injectable';
import { COLUMN_ATTRIBUTES, columnList } from './injectables/column-attributes';
import { GENERIC_DRUGS, genericDrugNames } from './injectables/generic-drugs.injectable';
import { TABLE_ATTRIBUTES, tableList } from './injectables/table-attributes.injectable';
import { TABLE_CONFIG, tableConfig } from './injectables/table-config.injectable';
import { MaterialModule } from './material-module';
import { CaseSplitPipe } from './pipes/case-split.pipe';
import { JoinPipe } from './pipes/join.pipe';
import { ToStringPipe } from './pipes/to-string.pipe';
import { AddComponent } from './svg/add/add.component';

export const firebase = provideFirebaseApp(() => initializeApp(environment.firebaseConfig));
export const firestore = provideFirestore(() => getFirestore());

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    ToolbarComponent,
    CaseSplitPipe,
    DrugFormComponent,
    SidebarComponent,
    ToStringPipe,
    DisclaimerComponent,
    AboutComponent,
    DesignComponent,
    ExpandedElementComponent,
    RotateDirective,
    TrackingGradientDirective,
    CreationSpyDirective,
    TabComponent,
    ColumnSelectorComponent,
    PopupComponent,
    GroupByComponent,
    JoinPipe,
    ListKeyDirective,
    DropItemComponent,
    AutoFocusDirective,
    LetDirective,
    CellPaddingDirective,
    KeyGridDirective,
    TableCardComponent,
    ExpandableRowDirective,
    GroupRowComponent,
    ExpandedRowCardComponent,
    BrandComponent,
    VerticalComponent,
    SearchButtonsComponent,
    MenuToggleComponent,
    AnimatedArrowComponent,
    AnimatedXComponent,
    TemplateContentDirective,
    TabLinkComponent,
    ErrorMessageComponent,
    CellComponent,
    ExpandToggleDirective,
    AddComponent,
    TextIconButtonComponent,
    IconButtonDirective,
    PopupContentDirective,
    PopupContentComponent,
    SidebarBrandDirective,
    SidebarToggleDirective,
    AutocompleteContentComponent,
    ToggleIconDirective,
    FilterBarComponent,
    FilterInputComponent,
    HighlightPipe,
    SafeHtmlPipe,
    TableComponent,
    RowToggleDirective,
    EntryRangeCardComponent,
    RippleDirective,
    SvgGradientDirective,
    GradientIconComponent,
  ],
  imports: [
    firebase,
    firestore,
    BrowserModule,
    BrowserAnimationsModule,
    ElderRoutingModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),

    MaterialModule,
  ],
  providers: [
    { provide: COLUMN_ATTRIBUTES, useValue: columnList },
    { provide: TABLE_ATTRIBUTES, useValue: tableList },
    { provide: TABLE_CONFIG, useValue: tableConfig },
    { provide: GENERIC_DRUGS, useValue: genericDrugNames },
    { provide: BEERS_ENTRIES, useValue: beersEntries },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [GradientIconComponent],
})
export class AppModule {}
