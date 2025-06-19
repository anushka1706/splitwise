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
  paidBy: { [key: string]: any } = {}
  evenAmount: number = 0
  splitBetween !: any[]
  splitAmount: { [key: string]: number } = {}
  errorMessage !: string
  error: boolean = false
  isValidAmount: boolean = false
  amountErrorMessage: string = ''
  amountError: boolean = false
  splitError: string = ''

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
      pendingAmount: ['', Validators.required]
    });
    this.userOptions = this.data.members
  }

  onSubmit() {
    this.expenseForm.get('splitBetween')?.setValue(this.splitBetween);
    this.dialogRef.close(this.expenseForm.value)
  }
  calculatePendingAmount() {
    let total = 0
    if (this.expenseForm.value.amount && this.expenseForm.value.splitBetween.length > 1) {
      this.splitBetween.forEach(user => {
        if (user.id !== this.paidBy['id']) {
          total += user.amount
        }
      })
      this.expenseForm.patchValue({ pendingAmount: total })

    }
  }

  onEvenAmount() {
    if (this.splitBetween && this.splitBetween.length) {
      const totalMembers = this.expenseForm.value.splitBetween.length
      this.evenAmount = +(this.expenseForm.value.amount / totalMembers).toFixed(2)
      this.splitBetween.forEach(user => {
        user['amount'] = this.evenAmount
      })
    }
    if (this.expenseForm.value.amount) {
      this.paidBy['amount'] = this.expenseForm.value.amount
      this.expenseForm.value.paidBy = this.paidBy
    }
    this.isValidAmount = true
  }
  setAmount(e: Event) {
    const input = e.target as HTMLInputElement;
    const value = parseFloat(input.value);
    if (value > 0) {
      this.paidBy['amount'] = value
      this.onEvenAmount()
      this.calculatePendingAmount()
      this.amountError = false
      this.amountErrorMessage = ''
    }
    else {
      this.amountError = true
      this.amountErrorMessage = 'Amount should be more than 0'
    }
  }
  onCustomAmount(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const valueStr = input.value.trim();

    if (valueStr === '') {
      this.splitBetween[index]['amount'] = 0;
      this.checkSum();
      return;
    }

    const value = parseFloat(valueStr);

    if (!isNaN(value) && value >= 0) {
      this.splitBetween[index]['amount'] = value;
      this.checkSum();
    }
    this.calculatePendingAmount()
  }
  checkSum() {
    this.isValidAmount = false
    let totalAmount = 0
    console.log(this.splitBetween)
    this.splitBetween.forEach(user => {
      if (user.amount && user.amount > 0) {
        totalAmount += user.amount
      }
    })
    if (this.expenseForm.value.amount) {
      this.paidBy['amount'] = this.expenseForm.value.amount
      this.expenseForm.value.paidBy = this.paidBy
      this.error = false
      this.errorMessage = ''
    }
    else return
    if (this.paidBy['amount'] === totalAmount) {
      this.errorMessage = ''
      this.error = false
      this.isValidAmount = true
    }
    else if (this.paidBy['amount'] >= totalAmount) {
      this.errorMessage = 'Custom amount is less than the paid amount'
      this.error = true
      this.isValidAmount = false
    }
    else if (this.paidBy['amount'] <= totalAmount) {
      this.errorMessage = 'Custom amount is more than the paid amount'
      this.error = true
      this.isValidAmount = false
    }
  }

  onSplitType() {
    this.type = this.expenseForm.value.splitType;
    this.splitBetween = this.expenseForm.value.splitBetween.map((user: any) => ({
      ...user,
      amount: 0
    }));

    if (this.type === 'even') {
      this.onEvenAmount();
    }
    const others = this.expenseForm.value.splitBetween.filter((u: any) => u.id !== this.paidBy['id']);

    if (others.length < 1) {
      this.error = true;
      this.splitError = 'Please select at least one more member to split with.';
      this.isValidAmount = false;
    }
    this.calculatePendingAmount()
  }
  onSplitBetweenChange() {
    const selected = this.expenseForm.value.splitBetween || [];
    const others = selected.filter((u: any) => u.id !== this.paidBy['id']);

    if (others.length < 1) {
      this.error = true;
      this.splitError = 'Please select at least one more member to split with.';
      this.isValidAmount = false;
    } else {
      this.error = false;
      this.errorMessage = '';
      this.onSplitType();
    }
  }

  onPaidBy() {
    this.paidBy = this.expenseForm.value.paidBy
    this.expenseForm.patchValue({ splitBetween: [this.paidBy] })
  }

  compareUsers = (a: any, b: any) => a?.id === b?.id;
}
