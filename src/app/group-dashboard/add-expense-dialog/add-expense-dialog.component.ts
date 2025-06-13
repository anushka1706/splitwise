import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupService } from 'src/group.service';

@Component({
  selector: 'app-add-expense-dialog',
  templateUrl: './add-expense-dialog.component.html',
  styleUrls: ['./add-expense-dialog.component.scss']
})
export class AddExpenseDialogComponent {
  expenseForm !: FormGroup
  userOptions !: any[]
  selectedUsers !: string[]
  splitType: string[] = ['even', 'custom']
  type !: string
  paidBy !: string
  evenAmount: number = 0
  splitBetween !: any[]

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddExpenseDialogComponent>,
    private groupService: GroupService,
    @Inject(MAT_DIALOG_DATA) private data: { members: any, groupId: number },
  ) { }

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', Validators.required],
      splitBetween: ['', Validators.required],
      splitType: ['', Validators.required],
      paidBy: ['', Validators.required],
      splitAmount: ['', Validators.required]
    });
    this.userOptions = this.data.members
  }

  onSubmit() {
    // this.dialogRef.close(this.groupForm.value)
    console.log(this.expenseForm.value)
  }
  calculateSplitAmount() {
    this.splitBetween = this.expenseForm.value.splitBetween
    console.log(this.splitBetween)
    switch (this.type) {
      case ('even'):
        const totalMembers = this.expenseForm.value.splitBetween.length
        this.evenAmount = +(this.expenseForm.value.amount / totalMembers).toFixed(2)
        break

      case ('custom'):
    }
  }
  onCustomAmount(e: Event) {

  }
  onSplitType() {
    this.type = this.expenseForm.value.splitType
    this.calculateSplitAmount()
  }
  onPaidBy() {
    const paidBy = this.expenseForm.value.paidBy
    this.expenseForm.patchValue({ splitBetween: [paidBy] })
  }
  compareUsers = (a: any, b: any) => a?.id === b?.id;
}
