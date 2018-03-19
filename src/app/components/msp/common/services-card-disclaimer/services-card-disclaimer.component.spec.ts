import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StatusInCanada } from "../../model/status-activities-documents";
import { ModalModule } from "ngx-bootstrap";

import { ServicesCardDisclaimerModalComponent } from './services-card-disclaimer.component';

describe('ServicesCardDisclaimerComponent', () => {
  let component: ServicesCardDisclaimerModalComponent;
  let fixture: ComponentFixture<ServicesCardDisclaimerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServicesCardDisclaimerModalComponent],
      imports: [ModalModule.forRoot()]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesCardDisclaimerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show modal by default', () => {
    expect(component.fullSizeViewModal.isShown).toBe(false, 'modal should not be shown without applicant status set');
  });

  it('should show modal when status is set to CitizenAdult', () => {
   // component.personStatus = StatusInCanada.CitizenAdult;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.fullSizeViewModal.isShown).toBe(true, 'modal show when status is CitizenAdult');
    });
  });

  it('should show modal when status is set to PermanentResident', () => {
  //  component.personStatus = StatusInCanada.PermanentResident;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.fullSizeViewModal.isShown).toBe(true, 'modal show when status is PermanentResident');
    });
  });

  it('should NOT show modal when status is set to TemporaryResident', () => {
   // component.personStatus = StatusInCanada.TemporaryResident;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.fullSizeViewModal.isShown).toBe(false, 'modal should NOT show when status is TemporaryResident');
    });
  });


  // it('should show modal when status changed to PermanentResident at runtime', () => {
  //   // fixture.detectChanges();
  //   // fixture.whenStable().then(() => {
  //   //   expect(component.fullSizeViewModal.isShown).toBe(false, 'modal should not show by default');
  //   //   component.personStatus = StatusInCanada.PermanentResident;
  //   //   fixture.detectChanges();
  //   //   fixture.whenStable().then(() => {
  //   //     expect(component.fullSizeViewModal.isShown).toBe(true, 'modal show when status is *changed* to PermanentResident');
  //   //   });
  //   // });

  //   // expect(component.fullSizeViewModal.isShown).toBe(false, 'modal should not show by default');
  //   // component.personStatus = StatusInCanada.PermanentResident;
  //   // console.log('TEST-1', component.personStatus, StatusInCanada.PermanentResident)
  //   // fixture.detectChanges();
  //   // // fixture.whenStable().then(() => {
  //   // setTimeout(() => {
  //   //   console.log('TEST-2', component.personStatus, StatusInCanada.PermanentResident)
  //   //   console.log('TEST-3', component.fullSizeViewModal.isShown)
  //   //   expect(component.fullSizeViewModal.isShown).toBe(true, 'modal show when status is *changed* to PermanentResident');
  //   // }, 0);
  //   // })
  // });

  xit('should show modal when status changed to PermanentResident at runtime (fakeAsync)', fakeAsync(() => {
    // fixture.detectChanges();
    // tick();
    // expect(component.fullSizeViewModal.isShown).toBe(false, 'modal should not show by default');
  //  component.personStatus = StatusInCanada.PermanentResident;
    // tick();
    fixture.detectChanges();
    tick();

    fixture.whenStable().then(() => {  
      expect(component.fullSizeViewModal.isShown).toBe(true, 'modal show when status is *changed* to PermanentResident');
    });
  }));

  it('should NOT show modal when status changed to TemporaryResident at runtime', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.fullSizeViewModal.isShown).toBe(false, 'modal should not show by default');
//      component.personStatus = StatusInCanada.TemporaryResident;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.fullSizeViewModal.isShown).toBe(false, 'modal show when status is *changed* to TemporaryResident');
      });
    })
  });

  it('should show modal when status changed to CitizenAdult at runtime', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.fullSizeViewModal.isShown).toBe(false, 'modal should not show by default');
   //   component.personStatus = StatusInCanada.CitizenAdult;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.fullSizeViewModal.isShown).toBe(true, 'modal show when status is *changed* to CitizenAdult');
      });
    });
  });

  it('should close on continue button', () => {
 //   component.personStatus = StatusInCanada.PermanentResident;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.fullSizeViewModal.isShown).toBe(true, 'modal show when status is PermanentResident');
      component.continue();
      fixture.detectChanges();
      expect(component.fullSizeViewModal.isShown).toBe(false, 'modal should be closed');
    });
  });

});
