import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountContainerComponent } from './account-container.component';

describe('AccountContainerComponent', () => {
  let component: AccountContainerComponent;
  let fixture: ComponentFixture<AccountContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
