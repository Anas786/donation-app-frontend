import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NzLayoutModule, NzMenuModule, NzFormModule, NzButtonModule, NzIconModule, NzBreadCrumbModule, NzPageHeaderModule, NzInputModule, NzMessageModule, NzStatisticModule, NzCardModule, NzTableModule, NzProgressModule, NzListModule, NzTagModule, NzSpinModule, NzDrawerModule, NgZorroAntdModule, NzSelectModule, NzDatePickerModule, NzInputNumberModule, NzPopconfirmModule, NzDividerModule, NzDropDownModule, NzAvatarModule, NzModalModule, NzSkeletonModule, NzUploadModule, NzAlertModule, NzToolTipModule } from 'ng-zorro-antd';
import { LayoutComponent } from './views/layout/layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { AgmCoreModule } from '@agm/core';
import { Angular2CsvModule } from 'angular2-csv';

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzLayoutModule,
    NzMenuModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzBreadCrumbModule,
    NzPageHeaderModule,
    NzMessageModule,
    NzStatisticModule,
    NzCardModule,
    NzSpinModule,
    HttpClientModule,
    RouterModule,
    ChartsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD-3nMw6mNWvPgKSXZo0c-jiG5RQl4EHRg'
    }),
    NzTableModule,
    NzProgressModule,
    NzListModule,
    NzTagModule,
    NzDrawerModule,
    NzSelectModule,
    NzDatePickerModule,
    NzInputNumberModule,
    Angular2CsvModule,
    NzPopconfirmModule,
    NzDividerModule,
    NzDropDownModule,
    NzAvatarModule,
    NzModalModule,
    NzSkeletonModule,
    NzUploadModule,
    NzAlertModule,
    NzToolTipModule
  ],
  exports: [
    LayoutComponent, 
    NzFormModule,
    NzMenuModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzBreadCrumbModule,
    NzPageHeaderModule,
    NzMessageModule,
    NzStatisticModule,
    NzCardModule,
    ChartsModule,
    AgmCoreModule,
    NzTableModule,
    NzProgressModule,
    NzListModule,
    NzTagModule,
    NzSpinModule,
    NzDrawerModule,
    NzSelectModule,
    NzDatePickerModule,
    NzInputNumberModule,
    Angular2CsvModule,
    NzPopconfirmModule,
    NzDividerModule,
    NzDropDownModule,
    NzAvatarModule,
    NzModalModule,
    NzSkeletonModule,
    NzUploadModule,
    NzAlertModule,
    NzToolTipModule
  ]
})
export class SharedModule { }
