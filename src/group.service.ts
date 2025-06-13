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
    this.allGroups.push(group)
    localStorage.setItem('groups', JSON.stringify(this.allGroups))
    this.groupObservable.next(this.allGroups)
  }

  getGroupById(id: number): Group {
    const group = this.allGroups.find(group => group.id == id)
    group ? this.viewGroup.next(group) : this.viewGroup.next(null)
    return group ? group : {} as Group;
  }
}
