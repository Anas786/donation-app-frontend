import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LookupsComponent } from './lookups/lookups.component';
import { LocationsComponent } from './locations/locations.component';
import { UsersComponent } from './users/users.component';
import { UsersAdminComponent } from './users_admin/users_admin.component';
import { UsersDealerComponent } from './users_dealer/users_dealer.component';
import { UsersDonorComponent } from './users_donor/users_donor.component';
import { UsersRecipientComponent } from './users_recipient/users_recipient.component';
import { ReportDealerComponent } from './reports/dealer/reportdealer.component';
import { ReportDonorComponent } from './reports/donor/reportdonor.component';
import { ReportRecipientComponent } from './reports/recipient/reportrecipient.component';
import { TransactionComponent } from './transaction/transaction.component';
@NgModule({
  declarations: [DashboardComponent, LoginComponent, LookupsComponent, LocationsComponent, UsersComponent, UsersAdminComponent, UsersDealerComponent, UsersDonorComponent, UsersRecipientComponent, ReportDealerComponent, ReportDonorComponent, ReportRecipientComponent, TransactionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule
  ]
})
export class PagesModule { }
