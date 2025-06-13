import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersTransactionsComponent } from './members-transactions.component';

describe('MembersTransactionsComponent', () => {
  let component: MembersTransactionsComponent;
  let fixture: ComponentFixture<MembersTransactionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MembersTransactionsComponent]
    });
    fixture = TestBed.createComponent(MembersTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
