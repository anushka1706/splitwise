import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettleDialogComponent } from './settle-dialog.component';

describe('SettleDialogComponent', () => {
  let component: SettleDialogComponent;
  let fixture: ComponentFixture<SettleDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettleDialogComponent]
    });
    fixture = TestBed.createComponent(SettleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
