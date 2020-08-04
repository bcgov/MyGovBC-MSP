import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../../../../services/header.service';
import { BenefitContainerComponent } from './benefit-container.component';

describe('BenefitContainerComponent', () => {
  let component: BenefitContainerComponent;
  let fixture: ComponentFixture<BenefitContainerComponent>;
  beforeEach(() => {
    const routerStub = () => ({});
    const headerServiceStub = () => ({ setTitle: string => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BenefitContainerComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: HeaderService, useFactory: headerServiceStub }
      ]
    });
    fixture = TestBed.createComponent(BenefitContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
