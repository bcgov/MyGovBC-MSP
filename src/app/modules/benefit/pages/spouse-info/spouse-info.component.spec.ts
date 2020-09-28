import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BenefitSpouseInfoComponent } from './spouse-info.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ProcessService } from '../../../../services/process.service';
import { Router } from '@angular/router';
import { MspBenefitDataService } from '../../services/msp-benefit-data.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Relationship } from '../../../../models/relationship.enum';
import { ModalModule } from 'ngx-bootstrap/modal';


describe('BenefitSpouseInfoComponent', () => {
  let component: BenefitSpouseInfoComponent;
  let fixture: ComponentFixture<BenefitSpouseInfoComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const processServiceStub = () => ({
      setStep: (processStepNum, arg) => ({})
    });
    const routerStub = () => ({ navigate: array => ({}) });
    const mspBenefitDataServiceStub = () => ({
      benefitApp: { setSpouse: {}, isUniquePhns: {}, isUniqueSin: {}, mailingAddress: {} },
      saveBenefitApplication: () => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BenefitSpouseInfoComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ProcessService, useFactory: processServiceStub },
        { provide: Router, useFactory: routerStub },
        {
          provide: MspBenefitDataService,
          useFactory: mspBenefitDataServiceStub
        }
      ],
      imports: [
        FormsModule,
        ModalModule.forRoot()
      ]
    });
    fixture = TestBed.createComponent(BenefitSpouseInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have default ProcessStepNum value`, () => {
    expect(BenefitSpouseInfoComponent.ProcessStepNum).toEqual(2);
  });

  it(`should have default Relationship value`, () => {
    expect(component.Relationship).toEqual(Relationship);
  });

  describe('onSubmit', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const ngFormStub: NgForm = <any>{};
      spyOn(routerStub, 'navigate').and.callThrough();
      component.onSubmit(ngFormStub);
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const processServiceStub: ProcessService = fixture.debugElement.injector.get(
        ProcessService
      );
      spyOn(processServiceStub, 'setStep').and.callThrough();
      component.ngOnInit();
      expect(processServiceStub.setStep).toHaveBeenCalled();
    });
  });

  describe('nextStep', () => {
    it('makes expected calls', () => {
      const processServiceStub: ProcessService = fixture.debugElement.injector.get(
        ProcessService
      );
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(processServiceStub, 'setStep').and.callThrough();
      spyOn(routerStub, 'navigate').and.callThrough();
      component.nextStep();
      expect(processServiceStub.setStep).toHaveBeenCalled();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
});
