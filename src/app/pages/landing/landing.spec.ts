import { TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing.component';
import { Router, RouterModule } from '@angular/router';
import { MspDataService } from '../../components/msp/service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';

/*
describe('LandingComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingComponent],
      imports:[RouterModule, LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        })],
      providers: [MspDataService,
        LocalStorageService]
  })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(LandingComponent)
    expect(fixture.componentInstance instanceof LandingComponent).toBe(true, 'should create LandingComponent')
    expect(fixture.componentInstance.lang('./en/index').pa).toContain('Apply')
  });
})
*/
