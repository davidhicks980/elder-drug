import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { initializeApp } from 'firebase/app';
import { MaterialModule } from './material-module';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { BrandComponent } from './components/brand/brand.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { ErrorComponent, LayoutComponent } from './components/layout/layout.component';
import { AnimatedArrowComponent } from './components/toggle/animated-arrow/animated-arrow.component';
import { AnimatedXComponent } from './components/toggle/animated-x/animated-x.component';
import { ToggleComponent } from './components/toggle/toggle.component';
import { ToggleIconDirective } from './components/toggle/toggle-icon.directive';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { AutocompleteContentComponent } from './components/autocomplete/autocomplete-content.component';
import {
  SearchDrawerBrandDirective,
  SearchDrawerToggleDirective,
} from './components/search-drawer/search-drawer.directive';
import { SearchFormDrawer } from './components/search-drawer/search-drawer.component';
import {
  AboutComponent,
  DisclaimerComponent,
  ToolbarComponent,
} from './components/toolbar/toolbar.component';
import { TabComponent } from './components/tabs/tab/tab.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { ColumnSelectorComponent } from './components/filter-popup/column-selector/column-selector.component';
import { GroupItem } from './components/filter-popup/group-by/group-item/group-item.component';
import { GroupFieldsComponent } from './components/filter-popup/group-by/group-fields.component';
import { PopupContentDirective } from './components/filter-popup/popup-content.directive';
import { PopupComponent } from './components/filter-popup/popup.component';
import { RangeCardComponent } from './components/table-range-card/detail-range-card.component';
import { RowDetailComponent } from './components/table-row-detail/row-detail.component';
import { RowDetailCardComponent } from './components/table-row-detail-card/detail-card.component';
import { FilterInputComponent } from './components/filter-input/filter-input.component';
import { GroupRowComponent } from './components/table-group-row/group-row.component';
import { HighlightPipe } from './pipes/highlight.pipe';
import { TableContainerComponent } from './components/table/table-container.component';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { TableComponent } from './components/table/table.component';
import { TemplateContentDirective } from './directives/content-template.directive';
import { RowDetailDirective } from './components/table-row-detail/row-detail.directive';
import { IconButtonDirective } from './directives/icon-button.directive';
import { KeyGridDirective, KeyObserverDirective } from './directives/keygrid.directive';
import { GradientIconDirective } from './directives/gradient-icon.directive';
import { TrackingGradientDirective } from './directives/tracking-gradient.directive';
import { LetDirective } from './directives/let.directive';
import { CaseSplitPipe } from './pipes/case-split.pipe';
import { JoinPipe } from './pipes/join.pipe';
import { ToStringPipe } from './pipes/to-string.pipe';
import { AppendPipe } from './pipes/append.pipe';
import { SentenceCasePipe } from './pipes/sentencecase.pipe';
import { DirectionsComponent } from './components/directions/directions.component';
import { NavigationDrawerComponent } from './components/navigation-drawer/navigation-drawer.component';
import { BEERS_ENTRIES, beersEntries } from './injectables/brand-drugs.injectable';
import { COLUMN_ATTRIBUTES, columnList } from './injectables/column-attributes';
import { GENERIC_DRUGS, genericDrugNames } from './injectables/generic-drugs.injectable';
import { TABLE_ATTRIBUTES, tableList } from './injectables/table-attributes.injectable';
import { TABLE_CONFIG, tableConfig } from './injectables/table-config.injectable';
import { ElderIconButtonComponent } from './components/toggle/toggle-plain/toggle-plain.component';
import { MoveableItemDirective } from './components/filter-popup/group-by/moveable-item.directive';
import {
  MatCheckboxDefaultOptions,
  MAT_CHECKBOX_DEFAULT_OPTIONS,
} from '@angular/material/checkbox';
export const firebaseModule = provideFirebaseApp(() => initializeApp(environment.firebaseConfig));
export const firestore = provideFirestore(() => getFirestore());
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    ToolbarComponent,
    CaseSplitPipe,
    ToStringPipe,
    JoinPipe,
    HighlightPipe,
    AppendPipe,
    SentenceCasePipe,
    DisclaimerComponent,
    AboutComponent,
    RowDetailComponent,
    TrackingGradientDirective,
    TabsComponent,
    ColumnSelectorComponent,
    PopupComponent,
    GroupFieldsComponent,
    SearchFormComponent,
    SearchFormDrawer,
    GroupItem,
    LetDirective,
    KeyGridDirective,
    TableContainerComponent,
    RowDetailDirective,
    GroupRowComponent,
    RowDetailCardComponent,
    BrandComponent,
    ToggleComponent,
    AnimatedArrowComponent,
    AnimatedXComponent,
    TemplateContentDirective,
    TabComponent,
    ErrorMessageComponent,
    IconButtonDirective,
    SearchDrawerBrandDirective,
    SearchDrawerToggleDirective,
    AutocompleteContentComponent,
    ToggleIconDirective,
    FilterBarComponent,
    FilterInputComponent,
    TableComponent,
    RangeCardComponent,
    GradientIconDirective,
    DirectionsComponent,
    PopupContentDirective,
    NavigationDrawerComponent,
    ErrorComponent,
    AutocompleteContentComponent,
    ElderIconButtonComponent,
    KeyObserverDirective,
    MoveableItemDirective,
  ],
  imports: [
    firebaseModule,
    firestore,
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    FormsModule,
    MaterialModule,
    RouterModule.forRoot([{ path: '**', component: LayoutComponent }]),
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    HttpClientModule,
  ],
  providers: [
    { provide: COLUMN_ATTRIBUTES, useValue: columnList },
    { provide: TABLE_ATTRIBUTES, useValue: tableList },
    { provide: TABLE_CONFIG, useValue: tableConfig },
    { provide: GENERIC_DRUGS, useValue: genericDrugNames },
    { provide: BEERS_ENTRIES, useValue: beersEntries },
    { provide: APP_BASE_HREF, useValue: '/' },
    {
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions,
    },
  ],

  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
