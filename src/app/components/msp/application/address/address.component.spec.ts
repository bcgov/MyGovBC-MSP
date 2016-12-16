import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';

import { AddressComponent } from './address.component'
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspApplication} from "../../model/application.model";
import {MspAddressComponent} from "../../common/address/address.component";
import {MspPhoneComponent} from "../../common/phone/phone.component";
import {Ng2CompleterModule} from "ng2-completer";
import {MspProvinceComponent} from "../../common/province/province.component";

describe('Application Address Component', () => {
    let localStorageServiceConfig = {
        prefix: 'ca.bc.gov.msp',
        storageType: 'localStorage'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AddressComponent, MspAddressComponent, MspPhoneComponent, MspProvinceComponent],
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
