import { Component, Input, OnInit } from '@angular/core';
import { GroupService } from 'src/group.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-net-balance',
  templateUrl: './net-balance.component.html',
  styleUrls: ['./net-balance.component.scss']
})
export class NetBalanceComponent {
  @Input() netBalance: {
    [memberId: number]: {
      name: string;
      youPaid: number;
      youShare: number;
      totalDiff: number;
    }
  } = {}

  constructor(private groupService: GroupService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.groupService.viewGroup.subscribe(data => {
      data?.netBalance ? this.netBalance = data.netBalance : {}
    })
  }
}
