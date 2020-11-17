import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from './services/header.service';
import { GeneralAppComponent } from './app.component';
import { Observable } from 'rxjs';

describe('GeneralAppComponent', () => {
  let component: GeneralAppComponent;
  let fixture: ComponentFixture<GeneralAppComponent>;

  beforeEach(() => {
    const viewContainerRefStub = () => ({});
    const routerStub = () => ({ events: new Observable() });
    const headerServiceStub = () => ({ title: new Observable() });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [GeneralAppComponent],
      providers: [
        { provide: ViewContainerRef, useFactory: viewContainerRefStub },
        { provide: Router, useFactory: routerStub },
        { provide: HeaderService, useFactory: headerServiceStub }
      ]
    });
    fixture = TestBed.createComponent(GeneralAppComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleRefresh', () => {
    it('should clear storage if route is /deam/home', () => {
      const spy = spyOn(component, 'clearStorage').and.stub();
      component.handleRefresh('/deam/home');
      expect(spy).toHaveBeenCalled();
    });
    
    it('should clear storage if route is /assistance/home', () => {
      const spy = spyOn(component, 'clearStorage').and.stub();
      component.handleRefresh('/assistance/home');
      expect(spy).toHaveBeenCalled();
    });
    
    it('should do nothing if route is /deam/confirmation', () => {
      const spyRedirect = spyOn(component, 'hardRedirect').and.stub();
      const spyStorage = spyOn(component, 'clearStorage').and.stub();
      component.handleRefresh('/deam/confirmation');
      expect(spyRedirect).not.toHaveBeenCalled();
      expect(spyStorage).not.toHaveBeenCalled();
    });
    
    it('should do nothing if route is /assistance/confirmation', () => {
      const spyRedirect = spyOn(component, 'hardRedirect').and.stub();
      const spyStorage = spyOn(component, 'clearStorage').and.stub();
      component.handleRefresh('/assistance/confirmation');
      expect(spyRedirect).not.toHaveBeenCalled();
      expect(spyStorage).not.toHaveBeenCalled();
    });

    it('should hard redirect if route is /deam/*, where * is anything other than home or confirmation', () => {
      const spy = spyOn(component, 'hardRedirect').and.stub();
      component.handleRefresh('/deam/personal-info');
      expect(spy).toHaveBeenCalled();
    });
    
    it('should hard redirect if route is /assistance/*, where * is anything other than home or confirmation', () => {
      const spy = spyOn(component, 'hardRedirect').and.stub();
      component.handleRefresh('/assistance/personal-info');
      expect(spy).toHaveBeenCalled();
    });
  });   
});
