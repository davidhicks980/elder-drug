import { CdkAccordionModule } from '@angular/cdk/accordion';
import { LayoutModule } from '@angular/cdk/layout';
import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    ScrollingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    OverlayModule,
    MatRippleModule,
    ObserversModule,
    CdkAccordionModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA], // add this line
})
export class AppModule {}
