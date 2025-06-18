import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupService } from 'src/group.service';

@Component({
  selector: 'app-settle-dialog',
  templateUrl: './settle-dialog.component.html',
  styleUrls: ['./settle-dialog.component.scss']
})
export class SettleDialogComponent implements OnInit {
  settleForm !: FormGroup
  filteredUsers !: any[]
  payTo: { [key: string]: any } = {}
  byWhom: { [key: string]: any } = {}
  payToUsers !: any[]
  byWhomUsers !: any[]
  settleAmount: number = 0
  error: boolean = false
  errorMessage !: string
  isSettlement: boolean = false

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SettleDialogComponent>,
    private groupService: GroupService,
    @Inject(MAT_DIALOG_DATA) public data: { group: any },
  ) { }

  ngOnInit(): void {
    this.settleForm = this.fb.group({
      to: ['', Validators.required],
      who: ['', Validators.required],
      amountPaid: ['', Validators.required],
    });

    this.payToUsers = [...this.data.group.members];
    this.byWhomUsers = [...this.data.group.members];
  }

  onSubmit() {
    this.dialogRef.close(this.settleForm.value)
  }
  onCancel() {
    this.dialogRef.close(false)
  }
  displayUser(user: any): string {
    return user ? user.name : '';
  }
  filterPayto() {
    this.byWhom = this.settleForm.value.who;
    this.checkSettlement()
  }
  filterByWhom() {
    this.payTo = this.settleForm.value.to;
    this.checkSettlement()
  }
  checkSettlement() {
    if (this.payTo['id'] && this.byWhom['id']) {
      const amountInfo = this.data.group.settle.filter((user: any) => user.id === this.byWhom['id'] && user.owesTo.id === this.payTo['id'])
      if (amountInfo.length && amountInfo[0].amount > 0) {
        this.error = false
        this.isSettlement = true
        this.settleAmount = amountInfo[0].amount
        this.settleForm.patchValue({ amountPaid: this.settleAmount })
      }
      else {
        this.isSettlement = false
        this.error = true
        this.errorMessage = `No settlement between ${this.payTo['name']} and ${this.byWhom['name']}`
      }
    }
    else return
  }
  onAmountChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const query = +input.value;
    if (query > this.settleAmount) {
      this.error = true
      this.errorMessage = 'Entered amount is more than owned amount'
    }
    else if (query <= 0) {
      this.error = true
      this.errorMessage = 'Enter valid amount'
    }
    else {
      this.error = false
      this.settleForm.patchValue({ amountPaid: query })
    }
  }
}
