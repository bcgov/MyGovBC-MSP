import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MspDataService } from "../../service/msp-data.service";
import { Router } from "@angular/router";
import { ProcessService } from "../../service/process.service";
import { LocalStorageModule } from "angular-2-local-storage";
import { Relationship } from "../../model/status-activities-documents";
import { AccountDependentChangeComponent } from "./dependent-change.component";
import { Person } from '../../model/person.model';
import { Address } from '../../model/address.model';
import { CaptchaDataService } from "../../../../../mygovbc-captcha-widget/src/app/captcha-data.service";
import { CaptchaComponent } from "../../../../../mygovbc-captcha-widget/src/app/captcha/captcha.component";

import { RouterTestingModule } from "@angular/router/testing";
import { MspLoggerDirective } from "../../common/logging/msp-logger.directive";
import { AddDependentComponent } from '../add-dependents/add-dependents.component';
import { AddNewDependentBeneficiaryComponent } from '../add-dependents/add-new-dependent-beneficiary/add-new-dependent-beneficiary.component'
import { RemoveDependentComponent } from '../remove-dependents/remove-dependents.component';
import { AccountPersonalDetailsComponent } from '../personal-info/personal-details/personal-details.component'
import { MspCancelComponent } from "../../common/cancel/cancel.component";
import { MspAddressComponent } from "../../common/address/address.component";
import { MspDateComponent } from "../../common/date/date.component";
import { MspToggleComponent } from "../../common/toggle/toggle.component";
import { MspStatusInCanadaRadioComponent } from '../../common/status-in-canada-radio/status-in-canada-radio.component';
import { MspNameComponent } from '../../common/name/name.component';
import { MspGenderComponent } from '../../common/gender/gender.component';
import { MspPhoneComponent } from '../../common/phone/phone.component';
import { MspBirthDateComponent } from '../../common/birthdate/birthdate.component';
import { MspProvinceComponent } from '../../common/province/province.component';
import { MspCountryComponent } from '../../common/country/country.component';
import { MspPhnComponent } from '../../common/phn/phn.component';
import { CalendarYearValidator } from '../../common/calendar/calendar-year.validator';
import { CalendarMonthValidator } from '../../common/calendar/calendar-month.validator';
import { CalendarDayValidator } from '../../common/calendar/calendar-day.validator';
import { CalendarYearFormatter } from '../../common/calendar/calendar-year-formatter.component';
import { MspDischargeDateComponent } from "../../common/discharge-date/discharge-date.component";
import { MspDepartureDateComponent } from "../../common/departure-date/departure-date.component";
import { MspReturnDateComponent } from "../../common/return-date/return-date.component";
import { MspOutofBCRecordComponent } from '../../common/outof-bc/outof-bc.component';
import { Mod11CheckValidator } from "../../common/phn/phn.validator";
import { Ng2CompleterModule } from "ng2-completer";
import { ModalModule } from "ngx-bootstrap";

import { MspLogService } from '../../service/log.service';
import { async } from '@angular/core/testing';
import { CompletenessCheckService } from '../../service/completeness-check.service';
import { MspValidationService} from '../../service/msp-validation.service';
import { ServicesCardDisclaimerModalComponent } from '../../../msp/common/services-card-disclaimer/services-card-disclaimer.component'



describe("AccountDependentChangeComponent", () => {
    let comp: AccountDependentChangeComponent;
    let fixture: ComponentFixture<AccountDependentChangeComponent>;


    beforeEach(async(() => {
        const processServiceStub = {
            getStepNumber: () => 3,
            setStep: () => {},
        };

        TestBed.configureTestingModule({
            declarations: [AccountDependentChangeComponent, CaptchaComponent, AddDependentComponent, RemoveDependentComponent, AccountPersonalDetailsComponent, MspLoggerDirective, MspCancelComponent, MspAddressComponent, MspToggleComponent, MspDateComponent, AddNewDependentBeneficiaryComponent, MspStatusInCanadaRadioComponent, MspNameComponent, MspGenderComponent, MspBirthDateComponent, MspPhnComponent, MspPhoneComponent, MspProvinceComponent, MspCountryComponent, CalendarYearValidator, CalendarMonthValidator, CalendarDayValidator, CalendarYearFormatter, MspDischargeDateComponent, MspOutofBCRecordComponent, Mod11CheckValidator, MspReturnDateComponent, MspDepartureDateComponent, ServicesCardDisclaimerModalComponent],
            providers: [
                MspDataService,
                { provide: ProcessService, useValue: processServiceStub },
                CaptchaDataService,
                MspLogService,
                CompletenessCheckService,
                MspValidationService
            ],
            imports: [FormsModule, 
                LocalStorageModule.withConfig({
                prefix: 'ca.bc.gov.msp',
                storageType: 'sessionStorage'
            }), 
            RouterTestingModule, Ng2CompleterModule, ModalModule.forRoot()]
        })
        .compileComponents();
    
    
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AccountDependentChangeComponent);
        comp = fixture.componentInstance;

        //Pass address validation, necessary to use component methods.
        let applicant = new Person(Relationship.Applicant);
        applicant.residentialAddress.addressLine1 = "123 Main Street";
        applicant.residentialAddress.city = "Victoria";
        applicant.residentialAddress.province = "British Columbia";
        applicant.residentialAddress.postal = "V8R 2N9";
        applicant.residentialAddress.country = "Canada"
        //Attach to data store, which component uses.
        let dataService = TestBed.get(MspDataService);
        dataService.getMspAccountApp().applicant = applicant;
        fixture.detectChanges();
    });


    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

    it("cannot add or remove dependents before passing validation", () => {
        // Undo the setup done in the beforeEach().
        TestBed.get(MspDataService).getMspAccountApp().applicant.residentialAddress = new Address();
        fixture.detectChanges();
        expect(comp.canAddDepdents()).toBe(false);
        expect(comp.canRemoveDependents()).toBe(false);
    });

    it("addedChildren/removedChildren defaults to: []", () => {
        expect(comp.addedChildren).toEqual([]);
        expect(comp.removedChildren).toEqual([]);
    });

    describe("onChange", () => {
        it("makes expected calls", () => {
            const mspDataServiceStub = fixture.debugElement.injector.get(MspDataService);
            spyOn(mspDataServiceStub, "saveMspAccountApp");
            comp.onChange();
            expect(mspDataServiceStub.saveMspAccountApp).toHaveBeenCalled();
        });
    });

    it("can add a spouse", () => {
        comp.addSpouse();
        expect(comp.addedSpouse).toBeDefined();
    });

    it("can clear an added spouse", () => {
        comp.addSpouse();
        expect(comp.addedSpouse).toBeDefined();
        let sp = comp.addedSpouse;
        comp.clearAddedSpouse();
        expect(comp.addedSpouse).toBeNull();
    });

    it("can add a child and clear them", () => {
        comp.addChild(Relationship.ChildUnder19);
        expect(comp.addedChildren.length).toBe(1);
        comp.addChild(Relationship.Child19To24);
        expect(comp.addedChildren.length).toBe(2);
        comp.clearAddedChild(comp.addedChildren[0]);
        comp.clearAddedChild(comp.addedChildren[0]); //second child, as indexes are reset
        expect(comp.addedChildren.length).toBe(0);        
    });

});
