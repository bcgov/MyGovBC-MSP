import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistAccountHolderComponent } from './assist-account-holder.component';

describe('AssistAccountHolderComponent', () => {
  let component: AssistAccountHolderComponent;
  let fixture: ComponentFixture<AssistAccountHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistAccountHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistAccountHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
