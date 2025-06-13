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
}
