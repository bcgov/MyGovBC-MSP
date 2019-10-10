import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AclConfirmationComponent } from './acl-confirmation.component';

describe('AclConfirmationComponent', () => {
  let component: AclConfirmationComponent;
  let fixture: ComponentFixture<AclConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AclConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AclConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
