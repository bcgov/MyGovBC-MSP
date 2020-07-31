import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountPersonalInfoComponent } from './personal-info.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { RouterTestingModule } from '@angular/router/testing';
import { ProcessService } from '../../../../services/process.service';
import { async } from '@angular/core/testing';
import {TextMaskModule} from 'angular2-text-mask';
import { StatusInCanada, CanadianStatusReason } from '../../../msp-core/models/canadian-status.enum';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';

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
                MspAccountMaintenanceDataService,
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
});
