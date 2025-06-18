import { Component, Input, OnInit } from '@angular/core';
import { GroupService } from 'src/group.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-members-transactions',
  templateUrl: './members-transactions.component.html',
  styleUrls: ['./members-transactions.component.scss']
})
export class MembersTransactionsComponent implements OnInit {
  @Input() members !: any[]

  constructor(private groupService: GroupService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      const groupId = params.get('id');
    });
    this.groupService.viewGroup.subscribe(data => {
      data?.settle ? this.members = data.settle : []
    })
  }
}
