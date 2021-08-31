import { A11yModule } from '@angular/cdk/a11y';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { LayoutModule } from '@angular/cdk/layout';
import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from '../environments/environment';
import { ElderRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { caseSplitPipe } from './case-split.pipe';
import { BrandComponent } from './components/brand/brand.component';
import { VerticalComponent } from './components/brand/vertical/vertical.component';
import { DropdownComponent } from './components/layout/dropdown/dropdown.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DrugFormComponent } from './components/layout/side-navigation/drug-form/drug-form.component';
import {
  SearchButtonsComponent,
} from './components/layout/side-navigation/drug-form/search-buttons/search-buttons.component';
import { SidebarComponent } from './components/layout/side-navigation/sidebar.component';
import { TabComponent } from './components/layout/tab/tab.component';
import {
  AboutComponent,
  DesignComponent,
  DisclaimerComponent,
  ToolbarComponent,
} from './components/layout/top-toolbar/toolbar.component';
import { ColumnSelectorComponent } from './components/table/dropdown/column-selector/column-selector.component';
import { ListContentComponent } from './components/table/dropdown/group-by/button/list-content.component';
import { GroupByComponent } from './components/table/dropdown/group-by/group-by.component';
import { PopupComponent } from './components/table/dropdown/popup.component';
import { ExpandedElementComponent } from './components/table/expanded-element/expanded-element.component';
import { ExpandedRowCardComponent } from './components/table/expanded-element/expanded-row-card/expanded-row-card.component';
import { FilterComponent } from './components/table/filter/filter.component';
import { GroupRowComponent } from './components/table/group-row/group-row.component';
import { TableCardComponent } from './components/table/table-card/table-card.component';
import { TableComponent } from './components/table/table.component';
import { ExpansionPanelComponent } from './components/unused/expansion-panel/expansion-panel.component';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { CellPaddingDirective } from './directives/cell-padding.directive';
import { CreationSpyDirective } from './directives/creation-spy.directive';
import { ExpandableRowDirective } from './directives/expandable-row.directive';
import { FilterDirective } from './directives/filter.directive';
import { KeyGridDirective } from './directives/keygrid.directive';
import { ListKeyDirective } from './directives/list-key.directive';
import { ResizeDirective } from './directives/resize.directive';
import { RotateDirective } from './directives/rotate-icon.directive';
import { TrackingGradientDirective } from './directives/tracking-gradient.directive';
import { LetDirective } from './directives/with.directive';
import { MaterialModule } from './material-module';
import { JoinPipe } from './pipes/join.pipe';
import { ToStringPipe } from './to-string.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    ToolbarComponent,
    caseSplitPipe,
    TableComponent,
    DrugFormComponent,
    SidebarComponent,
    ToStringPipe,
    DisclaimerComponent,
    AboutComponent,
    DesignComponent,
    ExpansionPanelComponent,
    ExpandedElementComponent,
    RotateDirective,
    TrackingGradientDirective,
    CreationSpyDirective,
    DropdownComponent,
    TabComponent,
    ColumnSelectorComponent,
    PopupComponent,
    ResizeDirective,
    GroupByComponent,
    JoinPipe,
    ListKeyDirective,
    ListContentComponent,
    AutoFocusDirective,
    LetDirective,
    CellPaddingDirective,
    KeyGridDirective,
    FilterComponent,
    FilterDirective,
    TableCardComponent,
    ExpandableRowDirective,
    GroupRowComponent,
    ExpandedRowCardComponent,
    BrandComponent,
    VerticalComponent,
    SearchButtonsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ElderRoutingModule,
    LayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,

    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    ScrollingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    OverlayModule,
    ObserversModule,
    CdkAccordionModule,
    A11yModule,
    FlexLayoutModule,
  ],
  providers: [ColumnSelectorComponent],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
