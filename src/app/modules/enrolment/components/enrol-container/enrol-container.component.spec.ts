import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedCoreModule } from 'moh-common-lib';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageModule } from 'angular-2-local-storage';
import { EnrolContainerComponent } from './enrol-container.component';
import { PageStateService } from '../../../../services/page-state.service';

describe('EnrolContainerComponent', () => {
  let component: EnrolContainerComponent;
  let fixture: ComponentFixture<EnrolContainerComponent>;
  const pageStateServiceStub = () => ({
    setPages: (arr, obj, arr2) => ({})
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrolContainerComponent ],
      imports: [
        SharedCoreModule,
        RouterTestingModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        })
      ],
      providers: [
        { provide: PageStateService, useFactory: pageStateServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
