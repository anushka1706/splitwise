import { Injectable } from '@angular/core';
import { Group } from './app/group.model';
import { BehaviorSubject } from 'rxjs';

interface Expense {
  expenseId: number,
  amount: number,
  split: any[],
  paidBy: { [key: string]: number | string }
}

interface Settle {
  memeberId: number,
  expenseId: number,
  amount: number,
  OwedTo: { [key: string]: number | string }
}

@Injectable({
  providedIn: 'root'
})

export class GroupService {
  users = [
    {
      id: 1,
      name: "Anushka"
    },
    {
      id: 2,
      name: "Parth"
    },
    {
      id: 3,
      name: "Alice"
    },
    {
      id: 4,
      name: "Bob"
    },
    {
      id: 5,
      name: "Alex"
    },
    {
      id: 6,
      name: "Justin"
    },
    {
      id: 7,
      name: "David"
    },
    {
      id: 8,
      name: "John"
    },
    {
      id: 9,
      name: "James"
    },
    {
      id: 10,
      name: "Bryan"
    }
  ]
  allGroups: Group[] = []
  groupObservable: BehaviorSubject<Group[]> = new BehaviorSubject<Group[]>([])
  viewGroup: BehaviorSubject<Group | null> = new BehaviorSubject<Group | null>(null)
  settlementSuccessObservable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor() {
    const groups = localStorage.getItem('groups')
    groups ? this.allGroups = JSON.parse(groups) : []
    this.groupObservable.next(this.allGroups)
  }

  generateId() {
    const now = new Date()
    return now.getTime()
  }

  adNewGroup(group: Group) {
    const netBalance: {
      [memberId: number]: {
        name: string;
        youPaid: number;
        youShare: number;
        totalDiff: number;
      };
    } = {};
    group.members.forEach(member => {
      netBalance[member.id] = {
        name: member.name,
        youPaid: 0,
        youShare: 0,
        totalDiff: 0
      };
    });
    group.netBalance = netBalance
    this.allGroups.push(group)
    console.log(this.allGroups)
    localStorage.setItem('groups', JSON.stringify(this.allGroups))
    this.groupObservable.next(this.allGroups)
  }

  getGroupById(id: number): Group {
    const group = this.allGroups.find(group => group.id == id)
    group ? this.viewGroup.next(group) : this.viewGroup.next(null)
    return group ? group : {} as Group;
  }

  addExpense(groupId: number, expense: any) {
    const group = this.allGroups.find(group => group.id == groupId);
    if (group) {
      if (!group.expenses) group.expenses = [];

      group.expenses.push(expense);

      const expIndex = group.expenses.findIndex(exp => exp.expenseId == expense.expenseId);
      if (expIndex !== -1) {
        group.expenses[expIndex].splitBetween.forEach((user: any) => {
          this.addSettle(group, user, expense);
        });
      }
      localStorage.setItem('groups', JSON.stringify(this.allGroups))
      this.groupObservable.next(this.allGroups)
      this.viewGroup.next(group)
    }
  }
  addSettle(group: Group, expUser: any, expense: any) {
    if (!group.settle) group.settle = [];

    const payerId = expense.paidBy.id;
    const payerName = expense.paidBy.name;
    const userId = expUser.id;
    const userName = expUser.name;
    const amount = expUser.amount;

    if (payerId === userId) return;

    const existing = group.settle.find(s => s.id === userId && s.owesTo.id === payerId);

    if (existing) {
      existing.amount += amount;
    } else {
      const reverse = group.settle.find(s => s.id === payerId && s.owesTo.id === userId);

      if (reverse) {
        if (reverse.amount > amount) {
          reverse.amount -= amount;
        } else if (reverse.amount < amount) {
          const diff = amount - reverse.amount;
          group.settle = group.settle.filter(s => !(s.id === payerId && s.owesTo.id === userId));
          group.settle.push({
            id: userId,
            name: userName,
            amount: diff,
            owesTo: { id: payerId, name: payerName },
            getsBack: false
          });
        } else {
          group.settle = group.settle.filter(s => !(s.id === payerId && s.owesTo.id === userId));
        }
      } else {
        group.settle.push({
          id: userId,
          name: userName,
          amount: amount,
          owesTo: { id: payerId, name: payerName },
          getsBack: false
        });
      }
    }
  }

  updateSettlement(group: Group, amount: number, owedUser: { [key: string]: any }, paidBy: { [key: string]: any }) {
    group.settle?.forEach(users => {
      if (users.id === owedUser['id'] && users.owesTo.id === paidBy['id']) {
        users.amount -= amount
      }
    })

    localStorage.setItem('groups', JSON.stringify(this.allGroups))
    this.groupObservable.next(this.allGroups)
    this.viewGroup.next(group)
  }
  updateNetBalanceAFterExpense(group: Group, expense: any) {
    const netBalance = group.netBalance;

    if (!netBalance) return;
    const payer = expense.paidBy;
    if (payer?.id && netBalance[payer.id]) {
      netBalance[payer.id].youPaid += +payer.amount;
    }

    expense.splitBetween?.forEach((user: any) => {
      if (user?.id && netBalance[user.id]) {
        netBalance[user.id].youShare += +user.amount;
      }
    });

    Object.keys(netBalance).forEach(memberId => {
      const m = netBalance[+memberId];
      m.totalDiff = +(m.youPaid - m.youShare).toFixed(2);
    });
    localStorage.setItem('groups', JSON.stringify(this.allGroups));
    this.groupObservable.next(this.allGroups);
    this.viewGroup.next(group);
  }

  updateNetBalanceAfterSettle(group: Group, settledData: any) {
    const netBalance = group.netBalance;

    if (!netBalance) return;
    if (netBalance[settledData.who.id] && netBalance[settledData.to.id]) {
      netBalance[settledData.who.id].youPaid += settledData.amountPaid;
      netBalance[settledData.to.id].youShare += settledData.amountPaid;
    }
    const settleEntry = group.settle?.find(
      s => s.id === settledData.to.id && s.owesTo.id === settledData.to.id
    );

    if (settleEntry && group.settle) {
      settleEntry.amount -= settledData.amountPaid;
      if (settleEntry.amount <= 0) {
        settleEntry.amount = 0
      }
    }

    Object.keys(netBalance).forEach(memberId => {
      const m = netBalance[+memberId];
      m.totalDiff = +(m.youPaid - m.youShare).toFixed(2);
    });

    group.netBalance = netBalance;
    localStorage.setItem('groups', JSON.stringify(this.allGroups));
    this.groupObservable.next(this.allGroups);
    this.viewGroup.next(group);
    this.settlementSuccessObservable.next(true)

  }
}