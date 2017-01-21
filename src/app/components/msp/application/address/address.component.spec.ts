import {TestBed, inject, async} from '@angular/core/testing'
import { FormsModule } from '@angular/forms';


import { AddressComponent } from './address.component'
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspApplication} from "../../model/application.model";
import {MspAddressComponent} from "../../common/address/address.component";
import {MspPhoneComponent} from "../../common/phone/phone.component";
import {Ng2CompleterModule} from "ng2-completer";
import {MspProvinceComponent} from "../../common/province/province.component";
import {MspOutsideBCComponent} from "../../common/outside-bc/outside-bc.component";
import {MspDepartureDateComponent} from "../../common/departure-date/departure-date.component";
import {MspReturnDateComponent} from "../../common/return-date/return-date.component";
import {MspCountryComponent} from "../../common/country/country.component";

describe('Application Address Component', () => {
    let localStorageServiceConfig = {
        prefix: 'ca.bc.gov.msp',
        storageType: 'localStorage'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AddressComponent, MspAddressComponent, MspPhoneComponent, MspProvinceComponent,
                MspOutsideBCComponent, MspDepartureDateComponent, MspReturnDateComponent, MspCountryComponent],
            imports: [FormsModule, Ng2CompleterModule],
            providers: [MspDataService,
                LocalStorageService,{
                    provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
                }
            ]
        })
    });

    it ('should work', () => {
        let fixture = TestBed.createComponent(AddressComponent);
        fixture.componentInstance.mspApplication = new MspApplication();
        expect(fixture.componentInstance instanceof AddressComponent).toBe(true, 'should create AddressComponent');
    });
})
