import { Component, Input, OnInit } from '@angular/core';
import { GroupService } from 'src/group.service';

@Component({
  selector: 'app-members-transactions',
  templateUrl: './members-transactions.component.html',
  styleUrls: ['./members-transactions.component.scss']
})
export class MembersTransactionsComponent implements OnInit {
  @Input() split !: any[]

  constructor(private groupService: GroupService) { }
  
  ngOnInit(): void {

  }
}
