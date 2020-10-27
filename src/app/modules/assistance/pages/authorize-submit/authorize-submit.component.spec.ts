import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MspDataService } from '../../../../services/msp-data.service';
import { ActivatedRoute } from '@angular/router';
import { AssistStateService } from '../../services/assist-state.service';
import { CommonImage } from 'moh-common-lib';
import { AssistanceAuthorizeSubmitComponent } from './authorize-submit.component';
import { FormsModule } from '@angular/forms';

describe('AssistanceAuthorizeSubmitComponent', () => {
  let component: AssistanceAuthorizeSubmitComponent;
  let fixture: ComponentFixture<AssistanceAuthorizeSubmitComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const mspDataServiceStub = () => ({
      finAssistApp: { powerOfAttorneyDocs: []},
      saveFinAssistApplication: () => ({})
    });
    const activatedRouteStub = () => ({
      snapshot: { routeConfig: { path: {} } }
    });
    const assistStateServiceStub = () => ({
      setPageIncomplete: path => ({}),
      setPageValid: (path, arg1) => ({}),
      touched: { asObservable: () => ({ subscribe: f => f({}) }) }
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AssistanceAuthorizeSubmitComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: MspDataService, useFactory: mspDataServiceStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: AssistStateService, useFactory: assistStateServiceStub }
      ],
      imports: [FormsModule]
    });
    fixture = TestBed.createComponent(AssistanceAuthorizeSubmitComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the default title value`, () => {
    expect(component.title).toEqual(`Authorize and submit your application`);
  });

  describe('addDocument', () => {
    it('makes expected calls', () => {
      const mspDataServiceStub: MspDataService = fixture.debugElement.injector.get(
        MspDataService
      );
      const commonImageStub: CommonImage = <any>{};
      spyOn(mspDataServiceStub, 'saveFinAssistApplication').and.callThrough();
      component.addDocument(commonImageStub);
      expect(mspDataServiceStub.saveFinAssistApplication).toHaveBeenCalled();
    });
  });

  describe('deleteDocument', () => {
    it('makes expected calls', () => {
      const mspDataServiceStub: MspDataService = fixture.debugElement.injector.get(
        MspDataService
      );
      const commonImageStub: CommonImage = <any>{};
      spyOn(mspDataServiceStub, 'saveFinAssistApplication').and.callThrough();
      component.deleteDocument(commonImageStub);
      expect(mspDataServiceStub.saveFinAssistApplication).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('makes calls to page state service', () => {
      const assistStateServiceStub: AssistStateService = fixture.debugElement.injector.get(
        AssistStateService
      );
      spyOn(assistStateServiceStub, 'setPageIncomplete').and.callThrough();
      component.ngOnInit();
      expect(assistStateServiceStub.setPageIncomplete).toHaveBeenCalled();
    });
    
    it('redirects if infoCollectionAgreement is false', () => {
      const redirectSpy = spyOn(component, 'redirect').and.stub();
      component.application.infoCollectionAgreement = false;
      component.ngOnInit();
      expect(redirectSpy).toHaveBeenCalled();
    });
    
    it('does not redirect if infoCollectionAgreement is true', () => {
      const redirectSpy = spyOn(component, 'redirect').and.stub();
      component.application.infoCollectionAgreement = true;
      component.ngOnInit();
      expect(redirectSpy).not.toHaveBeenCalled();
    });
  });
});
