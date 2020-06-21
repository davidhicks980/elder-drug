import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MaterialModule } from './material-module';
import { ToolbarComponent } from './navigation/top-toolbar/toolbar.component';
import { CaseSplitPipe } from './CaseSplitPipe';
import { ModifyTablePanelComponent } from './table-logic/modify-table-panel/modify-table-panel.component';
import { MedTableComponent } from './table-logic/med-table/med-table.component';
import { TableLogicComponent } from './table-logic/table-logic.component';
import { SmallLogoComponent } from './logo/small-logo/small-logo.component';
import { BigLogoComponent } from './logo/big-logo/big-logo.component';
import { EnterDrugFormComponent } from './navigation/enter-drug-form/enter-drug-form.component';
import { ColumnSelectorComponent } from './table-logic/med-table/column-selector/column-selector.component';
import { ToggleOptionsComponent } from './table-logic/med-table/toggle-options/toggle-options.component';
import { BottomNavigationComponent } from './navigation/bottom-navigation/bottom-navigation.component';
import { MatSortModule } from '@angular/material/sort';
import { SideNavigationComponent } from './navigation/side-navigation/side-navigation.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ToolbarComponent,
    ModifyTablePanelComponent,
    CaseSplitPipe,
    MedTableComponent,
    TableLogicComponent,
    SmallLogoComponent,
    BigLogoComponent,
    EnterDrugFormComponent,
    ColumnSelectorComponent,
    ToggleOptionsComponent,
    BottomNavigationComponent,
    SideNavigationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSliderModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    NgxDatatableModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
