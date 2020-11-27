import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { LookupsComponent } from './pages/lookups/lookups.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { UsersAdminComponent } from './pages/users_admin/users_admin.component';
import { UsersDonorComponent } from './pages/users_donor/users_donor.component';
import { UsersDealerComponent } from './pages/users_dealer/users_dealer.component';
import { UsersRecipientComponent } from './pages/users_recipient/users_recipient.component';
import { ReportDealerComponent } from './pages/reports/dealer/reportdealer.component';
import { ReportDonorComponent } from './pages/reports/donor/reportdonor.component';
import { ReportRecipientComponent } from './pages/reports/recipient/reportrecipient.component';
import { TransactionComponent } from './pages/transaction/transaction.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'lookups', component: LookupsComponent, canActivate: [AuthGuard] },
  { path: 'locations', component: LocationsComponent, canActivate: [AuthGuard] },
  { path: 'users_admin', component: UsersAdminComponent, canActivate: [AuthGuard] },
  { path: 'users_donor', component: UsersDonorComponent, canActivate: [AuthGuard] },
  { path: 'users_dealer', component: UsersDealerComponent, canActivate: [AuthGuard] },
  { path: 'users_recipient', component: UsersRecipientComponent, canActivate: [AuthGuard] },
  { path: 'report/dealer', component: ReportDealerComponent, canActivate: [AuthGuard] },
  { path: 'report/donor', component: ReportDonorComponent, canActivate: [AuthGuard] },
  { path: 'report/recipient', component: ReportRecipientComponent, canActivate: [AuthGuard] },
  { path: 'disbursements', component: TransactionComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
