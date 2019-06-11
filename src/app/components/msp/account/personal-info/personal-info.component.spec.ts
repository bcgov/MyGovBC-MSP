import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountPersonalInfoComponent } from './personal-info.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import { RouterTestingModule } from '@angular/router/testing';
import { ProcessService } from '../../../../services/process.service';
import { async } from '@angular/core/testing';
import { StatusInCanada, Activities } from '../../model/status-activities-documents';
import {TextMaskModule} from 'angular2-text-mask';

describe('AccountPersonalInfoComponent', () => {
    let fixture: ComponentFixture<AccountPersonalInfoComponent>;
    let comp: AccountPersonalInfoComponent;

    beforeEach(async(() => {
        const processServiceStub = {
            getStepNumber: () => 3,
            setStep: () => {},
        };


        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [AccountPersonalInfoComponent],
            imports: [ TextMaskModule, FormsModule, RouterTestingModule, LocalStorageModule.withConfig({
                prefix: 'ca.bc.gov.msp',
                storageType: 'sessionStorage'
            })],
            providers: [
                MspDataService,
                { provide: ProcessService, useValue: processServiceStub },
            ]
        });

    }));


    beforeEach(() => {
        fixture = TestBed.createComponent(AccountPersonalInfoComponent);
        comp = fixture.componentInstance;
    });

    it('should work', () => {
        expect(comp instanceof AccountPersonalInfoComponent).toBe(true, 'should create AccountPersonalInfoComponent');
    });

    it('should have an invalid status by default', () => {
        expect(comp.hasAnyInvalidStatus()).toBe(false, 'should have hasAnyInvalidStatus false on init');
    });

    it('should have a valid status without a status update', () => {
        const mspAccountApp =  TestBed.get(MspDataService).getMspAccountApp();
        mspAccountApp.accountChangeOptions.statusUpdate = true;
        comp.addUpdateSpouse();
        mspAccountApp.updatedSpouse.status = StatusInCanada.TemporaryResident;
        mspAccountApp.updatedSpouse.currentActivity =  Activities.Visiting;
        fixture.detectChanges();
        expect(comp.hasAnyInvalidStatus()).toBe(true, 'added spouse is just visiting so hasAnyInvalidStatus should be true');
    });

    it('should be able to add and remove a spouse', () => {
        expect(comp.hasAnyInvalidStatus()).toBe(false, 'should have hasAnyInvalidStatus false on init');

        const mspAccountApp =  TestBed.get(MspDataService).getMspAccountApp();
        mspAccountApp.accountChangeOptions.statusUpdate = true;
        comp.addUpdateSpouse();
        mspAccountApp.updatedSpouse.status = StatusInCanada.TemporaryResident;
        mspAccountApp.updatedSpouse.currentActivity =  Activities.Visiting;
        expect(comp.hasAnyInvalidStatus()).toBe(true, 'should have hasAnyInvalidStatus true after adding new spouse');
        comp.removeSpouse();

        expect(comp.hasAnyInvalidStatus()).toBe(false, 'should have hasAnyInvalidStatus false after removing spouse');
    });

});
