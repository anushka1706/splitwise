import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { GroupDashboardComponent } from './group-dashboard/group-dashboard.component';
import { ViewGroupComponent } from './group-dashboard/view-group/view-group.component';


const routes: Routes = [

    {
        path: '',
        children: [
            { path: '', redirectTo: 'group-dashboard', pathMatch: 'full' },
            { path: 'group-dashboard', component: GroupDashboardComponent },
            { path: 'view-group', component: ViewGroupComponent }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }