import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/group.service';
import { Group } from 'src/app/group.model';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddExpenseDialogComponent } from '../add-expense-dialog/add-expense-dialog.component';
import { SettleDialogComponent } from '../settle-dialog/settle-dialog.component';
@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.scss']
})
export class ViewGroupComponent implements OnInit {
  id !: number
  group !: Group | any

  constructor(private groupService: GroupService, private dialog: MatDialog, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.id = idParam ? +idParam : 0;
    });
    this.groupService.getGroupById(this.id)
    this.groupService.viewGroup.subscribe(groupData => {
      this.group = groupData
    })
  }
  openExpenseDialog(): void {
    const dialog = this.dialog.open(AddExpenseDialogComponent, {
      disableClose: true,
      panelClass: 'form-container',
      data: { members: this.group['members'], groupId: this.id }
    });
    dialog.afterClosed().subscribe(groupData => {
      if (groupData) {
        const data = {
          expenseId: this.groupService.generateId(),
          paidBy: groupData['paidBy'],
          splitBetween: groupData['splitBetween'],
          pendingAmount: groupData['pendingAmount'],
          description: groupData['description']
        }
        this.groupService.addExpense(this.id, data)
        this.groupService.updateNetBalanceAFterExpense(this.group, data)
      }
    })
  }
  openSettleDialog() {
    const dialog = this.dialog.open(SettleDialogComponent, {
      disableClose: true,
      panelClass: 'settle-container',
      data: { group: this.group }
    });
    dialog.afterClosed().subscribe(settleData => {
      if (settleData) {
        this.groupService.updateSettlement(this.group, settleData['amountPaid'], settleData['who'], settleData['to'])
        this.groupService.updateNetBalanceAfterSettle(this.group, settleData)
      }
      const success = this.groupService.settlementSuccessObservable.getValue()
      if (success) {
        this.snackBar.open(`settled ₹${settleData.amountPaid} by ${settleData.who.name} to ${settleData.to.name}`, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['custom-snackbar']
        });
      }
    })
  }
  onGroupBalance() {
    this.router.navigate(['group-balance'], {
      relativeTo: this.route
    });
  }
  onNetBalance() {
    this.router.navigate(['net-balance'], {
      relativeTo: this.route
    });
  }
}
