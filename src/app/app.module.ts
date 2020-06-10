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
import { ToolbarComponent } from './tables/toobar.component';
import { TableViewComponent } from './tables/table-view/table-view.component';
import { CaseSplitPipe } from './CaseSplitPipe';
import { ModifyTablePanelComponent } from './modify-table-panel/modify-table-panel.component';
import { MedTableComponent } from './med-table/med-table.component';
import { TableLogicComponent } from './table-logic/table-logic.component';
import { SmallLogoComponent } from './small-logo/small-logo.component';
import { BigLogoComponent } from './big-logo/big-logo.component';
import { EnterDrugFormComponent } from './enter-drug-form/enter-drug-form.component';
import { ColumnSelectorComponent } from './med-table/column-selector/column-selector.component';
import { ToggleOptionsComponent } from './med-table/toggle-options/toggle-options.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ToolbarComponent,
    TableViewComponent,
    ModifyTablePanelComponent,
    CaseSplitPipe,
    MedTableComponent,
    TableLogicComponent,
    SmallLogoComponent,
    BigLogoComponent,
    EnterDrugFormComponent,
    ColumnSelectorComponent,
    ToggleOptionsComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
