import { Component, OnInit } from '@angular/core';
import { NewGroupDialogComponent } from './new-group-dialog/new-group-dialog.component';
import { GroupService } from 'src/group.service';
import { Group } from '../group.model';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-dashboard',
  templateUrl: './group-dashboard.component.html',
  styleUrls: ['./group-dashboard.component.scss']
})
export class GroupDashboardComponent implements OnInit {
  allGroups !: Group[]

  constructor(private GroupService: GroupService, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.GroupService.groupObservable.subscribe(groupData => {
      this.allGroups = groupData
    })
  }
  openDialog(): void {
    const dialog = this.dialog.open(NewGroupDialogComponent, {
      disableClose: true,
      width: '550px',
      height: '300px',
      panelClass: 'form-container'
    });
    dialog.afterClosed().subscribe(groupData => {
      if (groupData) {
        const data = {
          id: this.GroupService.generateId(),
          name: groupData.name,
          members: groupData.members,
          expenses: [],
          settle: [],
        }
        this.GroupService.adNewGroup(data)
      }
    })
  }
  onView(id: number) {
    this.router.navigate(['/view-group', id]);
  }
}
