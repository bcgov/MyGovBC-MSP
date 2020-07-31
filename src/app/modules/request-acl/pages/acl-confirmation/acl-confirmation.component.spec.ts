import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AclConfirmationComponent } from './acl-confirmation.component';
import { ApiStatusCodes } from 'moh-common-lib';

describe('AclConfirmationComponent', () => {
  let component: AclConfirmationComponent;
  let fixture: ComponentFixture<AclConfirmationComponent>;

  beforeEach(async(() => {
    const activatedRouteStub = () => ({
      queryParams: { subscribe: f => f({}) }
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ AclConfirmationComponent ],
      providers: [{ provide: ActivatedRoute, useFactory: activatedRouteStub }]
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
  
  it('should have default status value', () => {
    expect(component.status).toEqual(ApiStatusCodes.ERROR);
  });
});
