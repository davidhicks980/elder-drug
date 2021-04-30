import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { LayoutModule } from '@angular/cdk/layout';
import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
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
import { DropdownComponent } from './components/layout/dropdown/dropdown.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DrugFormComponent } from './components/layout/side-navigation/drug-form/drug-form.component';
import { SidebarComponent } from './components/layout/side-navigation/sidebar.component';
import { TabComponent } from './components/layout/tab/tab.component';
import {
  AboutComponent,
  DesignComponent,
  DisclaimerComponent,
  ToolbarComponent,
} from './components/layout/top-toolbar/toolbar.component';
import { TableComponent } from './components/table/table.component';
import { ExpandedElementComponent } from './components/unused/expanded-element/expanded-element.component';
import { ExpansionPanelComponent } from './components/unused/expansion-panel/expansion-panel.component';
import { LogoComponent } from './components/unused/logo/small-logo/logo-component';
import { CreationSpyDirective } from './directives/creation-spy.directive';
import { RotateDirective } from './directives/rotate-icon.directive';
import { TrackingGradientDirective } from './directives/tracking-gradient.directive';
import { MaterialModule } from './material-module';
import { ToStringPipe } from './to-string.pipe';
import { ColumnSelectorComponent } from './components/table/dropdown/column-selector/column-selector.component';
import { PopupComponent } from './components/table/dropdown/popup.component';
import { ResizeDirective } from './directives/resize.directive';
import { GroupByComponent } from './components/table/dropdown/group-by/group-by.component';
import { JoinPipe } from './pipes/join.pipe';
import { ListKeyDirective } from './directives/list-key.directive';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    ToolbarComponent,
    caseSplitPipe,
    TableComponent,
    LogoComponent,
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
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ElderRoutingModule,
    LayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
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
  ],
  providers: [ColumnSelectorComponent],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
