import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GroupService } from 'src/group.service';

@Component({
  selector: 'app-new-group-dialog',
  templateUrl: './new-group-dialog.component.html',
  styleUrls: ['./new-group-dialog.component.scss']
})
export class NewGroupDialogComponent implements OnInit {
  groupForm !: FormGroup
  userOptions !: any[]
  selectedUsers !: string[]
  error: boolean = false
  errorMessage !: string

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewGroupDialogComponent>,
    private groupService: GroupService
  ) { }

  ngOnInit(): void {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      members: ['', Validators.required],
    });
    this.userOptions = this.groupService.users
  }

  onSubmit() {
    this.dialogRef.close(this.groupForm.value)
  }
  onCancel() {
    this.dialogRef.close()
  }
  checkMinimumUsers() {
    const members = this.groupForm.value.members;
    if (!members || members.length <= 1) {
      this.error = true;
      this.errorMessage = 'There should be at least 2 members';
    } else {
      this.error = false;
      this.errorMessage = '';
    }
  }
compareUsers = (a: any, b: any): boolean => a?.id === b?.id;

}
