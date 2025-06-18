import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MembersTransactionsComponent } from './group-dashboard/members-transactions/members-transactions.component';
import { GroupDashboardComponent } from './group-dashboard/group-dashboard.component';
import { ViewGroupComponent } from './group-dashboard/view-group/view-group.component';
import { NetBalanceComponent } from './group-dashboard/net-balance/net-balance.component';

const routes: Routes = [

    {
        path: '',
        children: [
            { path: '', redirectTo: 'group-dashboard', pathMatch: 'full' },
            { path: 'group-dashboard', component: GroupDashboardComponent },
            {
                path: 'view-group/:id',
                component: ViewGroupComponent,
                children: [
                    { path: '', redirectTo: 'group-balance', pathMatch: 'full' },
                    { path: 'group-balance', component: MembersTransactionsComponent },
                    { path: 'net-balance', component: NetBalanceComponent }
                ]
            }
        ]
    },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }