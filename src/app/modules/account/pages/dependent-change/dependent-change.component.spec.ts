import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspDataService } from '../../../../services/msp-data.service';
import { ProcessService } from '../../../../services/process.service';
import { LocalStorageModule } from 'angular-2-local-storage';

import { AccountDependentChangeComponent } from './dependent-change.component';

import {TextMaskModule} from 'angular2-text-mask';
import { RouterTestingModule } from '@angular/router/testing';

import { AddDependentComponent } from '../../../../models/add-dependents.component';
import { AddNewDependentBeneficiaryComponent } from '../add-dependents/add-new-dependent-beneficiary/add-new-dependent-beneficiary.component';
import { RemoveDependentComponent } from '../remove-dependents/remove-dependents.component';
import { AccountPersonalDetailsComponent } from '../personal-info/personal-details/personal-details.component';
import { MspAddressComponent } from '../../../../modules/msp-core/components/address/address.component';
import { MspStatusInCanadaRadioComponent } from '../../../../modules/msp-core/components/status-in-canada-radio/status-in-canada-radio.component';
import { MspBirthDateComponent } from '../../../../modules/msp-core/components/birthdate/birthdate.component';
import { TypeaheadModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { MspLogService } from '../../../../services/log.service';
import { async } from '@angular/core/testing';
import { CompletenessCheckService } from '../../../../services/completeness-check.service';
import { MspValidationService} from '../../../../services/msp-validation.service';


describe('AccountDependentChangeComponent', () => {
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
                TextMaskModule,
                LocalStorageModule.withConfig({
                prefix: 'ca.bc.gov.msp',
                storageType: 'sessionStorage'
            }),
            RouterTestingModule, TypeaheadModule, ModalModule.forRoot()]
        })
        .compileComponents();


    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AccountDependentChangeComponent);
        comp = fixture.componentInstance;

        //Pass address validation, necessary to use component methods.
        const applicant = new Person(Relationship.Applicant);
        applicant.residentialAddress.addressLine1 = '123 Main Street';
        applicant.residentialAddress.city = 'Victoria';
        applicant.residentialAddress.province = 'British Columbia';
        applicant.residentialAddress.postal = 'V8R 2N9';
        applicant.residentialAddress.country = 'Canada';
        //Attach to data store, which component uses.
        const dataService = TestBed.get(MspDataService);
        dataService.getMspAccountApp().applicant = applicant;
        fixture.detectChanges();
    });


    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('cannot add or remove dependents before passing validation', () => {
        // Undo the setup done in the beforeEach().
        TestBed.get(MspDataService).getMspAccountApp().applicant.residentialAddress = new Address();
        fixture.detectChanges();
        expect(comp.canAddDepdents()).toBe(false);
        expect(comp.canRemoveDependents()).toBe(false);
    });

    it('addedChildren/removedChildren defaults to: []', () => {
        expect(comp.addedChildren).toEqual([]);
        expect(comp.removedChildren).toEqual([]);
    });

    describe('onChange', () => {
        it('makes expected calls', () => {
            const mspDataServiceStub = fixture.debugElement.injector.get(MspDataService);
            spyOn(mspDataServiceStub, 'saveMspAccountApp');
            comp.onChange();
            expect(mspDataServiceStub.saveMspAccountApp).toHaveBeenCalled();
        });
    });

    it('can add a spouse', () => {
        comp.addSpouse();
        expect(comp.addedSpouse).toBeDefined();
    });

    it('can clear an added spouse', () => {
        comp.addSpouse();
        expect(comp.addedSpouse).toBeDefined();
        comp.clearAddedSpouse();
        expect(comp.addedSpouse).toBeNull();
    });

    it('can add a child and clear them', () => {
        comp.addChild(Relationship.ChildUnder19);
        expect(comp.addedChildren.length).toBe(1);
        comp.addChild(Relationship.Child19To24);
        expect(comp.addedChildren.length).toBe(2);
        comp.clearAddedChild(comp.addedChildren[0]);
        comp.clearAddedChild(comp.addedChildren[0]); //second child, as indexes are reset
        expect(comp.addedChildren.length).toBe(0);
    });

});
