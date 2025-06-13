import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/group.service';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/group.model';
import { MatDialog } from '@angular/material/dialog';
import { AddExpenseDialogComponent } from '../add-expense-dialog/add-expense-dialog.component';

@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.scss']
})
export class ViewGroupComponent implements OnInit {
  id !: number
  group !: Group | any

  constructor(private groupService: GroupService, private dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.id = param['id']
    })
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
    // dialog.afterClosed().subscribe(groupData => {
    //   const data = {
    //     //   id: this.GroupService.generateId(),
    //     //   name: groupData.name,
    //     //   members: groupData.members,
    //     //   expenses: [],
    //     //   settle: [],
    //   }
    //   // this.GroupService.adNewExpense(data)
    // })
  }
}
