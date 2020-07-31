import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SharedCoreModule } from 'moh-common-lib';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountFileUploaderComponent } from './account-file-uploader.component';
import { MspAccountApp } from '../../../models/account.model';

describe('AccountFileUploaderComponent', () => {
  let component: AccountFileUploaderComponent;
  let fixture: ComponentFixture<AccountFileUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountFileUploaderComponent ],
      imports: [
        FormsModule,
        SharedCoreModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountFileUploaderComponent);
    component = fixture.componentInstance;
    component.accountApp = new MspAccountApp();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
