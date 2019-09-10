import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountFileUploaderComponent } from './account-file-uploader.component';

describe('AccountFileUploaderComponent', () => {
  let component: AccountFileUploaderComponent;
  let fixture: ComponentFixture<AccountFileUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountFileUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountFileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
