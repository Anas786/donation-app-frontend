import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { JobsComponent } from './jobs/jobs.component';
import { LookupsComponent } from './lookups/lookups.component';
import { UsersComponent } from './users/users.component';
import { UsersAdminComponent } from './users_admin/users_admin.component';
import { UsersDealerComponent } from './users_dealer/users_dealer.component';
import { UsersDonorComponent } from './users_donor/users_donor.component';
import { UsersRecipientComponent } from './users_recipient/users_recipient.component';

@NgModule({
  declarations: [DashboardComponent, LoginComponent, JobsComponent, LookupsComponent, UsersComponent, UsersAdminComponent, UsersDealerComponent, UsersDonorComponent, UsersRecipientComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule
  ]
})
export class PagesModule { }
