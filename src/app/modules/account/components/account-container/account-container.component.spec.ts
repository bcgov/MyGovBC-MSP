import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedCoreModule, PageStateService } from 'moh-common-lib';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountContainerComponent } from './account-container.component';
import { HeaderService } from '../../../../services/header.service';

describe('AccountContainerComponent', () => {
  let component: AccountContainerComponent;
  let fixture: ComponentFixture<AccountContainerComponent>;
  const headerServiceStub = {
    setTitle: jasmine.createSpy('setTitle')
  }
  const pageStateServiceStub = {
    setPages: jasmine.createSpy('setPages')
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountContainerComponent ],
      imports: [
        RouterTestingModule,
        SharedCoreModule
      ],
      providers: [
        { provide: HeaderService, useValue: headerServiceStub },
        { provide: PageStateService, useValue: pageStateServiceStub }
      ]
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

  it('should set the header title', () => {
    expect(headerServiceStub.setTitle).toHaveBeenCalledWith('Account Management');
  });

  it('should set the page state', () => {
    expect(pageStateServiceStub.setPages).toHaveBeenCalled();
  });
});
