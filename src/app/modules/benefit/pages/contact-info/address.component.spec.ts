import {TestBed} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BenefitAddressComponent } from './address.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { CompletenessCheckService } from '../../../../services/completeness-check.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import {BenefitApplication} from '../../models/benefit-application.model';
import {MspAddressComponent} from '../../../msp-core/components/address/address.component';
import { TypeaheadModule } from 'ngx-bootstrap';
import {MspDepartureDateComponent} from '../../../../components/msp/common/departure-date/departure-date.component';
import {MspReturnDateComponent} from '../../../../components/msp/common/return-date/return-date.component';
import {MspCancelComponent} from '../../../../components/msp/common/cancel/cancel.component';
import {ModalModule} from 'ngx-bootstrap';
import {MspLoggerDirective} from '../../../msp-core/components/logging/msp-logger.directive';
import { MspLogService } from '../../../../services/log.service';
import { ProcessService } from '../../../../services/process.service';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';

describe('Application Address Component Test', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BenefitAddressComponent, MspAddressComponent,
                MspDepartureDateComponent, MspReturnDateComponent, 
                MspCancelComponent, MspLoggerDirective],
            imports: [FormsModule, TypeaheadModule, ModalModule.forRoot(), HttpClientModule, RouterTestingModule, LocalStorageModule.withConfig({
                prefix: 'ca.bc.gov.msp',
                storageType: 'sessionStorage'
              })],
            providers: [MspDataService, CompletenessCheckService, MspLogService, ProcessService
            ]
        });
    });

    it ('should work', () => {
        const fixture = TestBed.createComponent(BenefitAddressComponent);

        (fixture.componentInstance as BenefitAddressComponent).mspApplication = new BenefitApplication();

        expect(fixture.componentInstance instanceof BenefitAddressComponent).toBe(true, 'should create AddressComponent');
    });
});
