import {TestBed} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BenefitAddressComponent } from './address.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { CompletenessCheckService } from '../../../../services/completeness-check.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import {BenefitApplication} from '../../models/benefit-application.model';
import { TypeaheadModule } from 'ngx-bootstrap';
import {MspCancelComponent} from '../../../../components/msp/common/cancel/cancel.component';
import {ModalModule} from 'ngx-bootstrap';
import { MspLogService } from '../../../../services/log.service';
import { ProcessService } from '../../../../services/process.service';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import { MspCoreModule } from '../../../msp-core/msp-core.module';

describe('Application Address Component Test', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BenefitAddressComponent,
                MspCancelComponent],
            imports: [FormsModule, TypeaheadModule, ModalModule.forRoot(), HttpClientModule, RouterTestingModule, LocalStorageModule.withConfig({
                prefix: 'ca.bc.gov.msp',
                storageType: 'sessionStorage'
              }),
            MspCoreModule],
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
