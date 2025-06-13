import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GroupDashboardComponent } from './group-dashboard/group-dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { ViewGroupComponent } from './group-dashboard/view-group/view-group.component';
import { NewGroupDialogComponent } from './group-dashboard/new-group-dialog/new-group-dialog.component';
import { MembersTransactionsComponent } from './group-dashboard/members-transactions/members-transactions.component';
import { AddExpenseDialogComponent } from './group-dashboard/add-expense-dialog/add-expense-dialog.component';
import { SettleDialogComponent } from './group-dashboard/settle-dialog/settle-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    GroupDashboardComponent,
    ViewGroupComponent,
    NewGroupDialogComponent,
    MembersTransactionsComponent,
    AddExpenseDialogComponent,
    SettleDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
