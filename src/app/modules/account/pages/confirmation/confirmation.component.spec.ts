import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountConfirmationComponent } from './confirmation.component';

describe('AccountConfirmationComponent', () => {
  let component: AccountConfirmationComponent;
  let fixture: ComponentFixture<AccountConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
