import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { ReviewComponent } from './review.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { MspPersonCardComponent } from '../../../msp-core/components/person-card/person-card.component';
import { ContactCardComponent } from '../../../msp-core/components/contact-card/contact-card.component';
import { ModalModule } from 'ngx-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { MspCancelComponent  } from '../../../../components/msp/common/cancel/cancel.component';
import { MspLogService } from '../../../../services/log.service';
import { ProcessService } from '../../../../services/process.service';
import { MspAddressCardPartComponent } from '../../../msp-core/components/address-card-part/address-card-part.component';
import { SharedCoreModule } from 'moh-common-lib';



describe('ReviewComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReviewComponent,
        MspPersonCardComponent,
        MspAddressCardPartComponent,
        ContactCardComponent,
        MspCancelComponent
      ],
      imports: [
        FormsModule,
        SharedCoreModule,
        ModalModule.forRoot(),
        RouterTestingModule,
        HttpClientModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        })
    ],
      providers: [
        MspDataService,
        MspLogService,
        ProcessService
      ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(ReviewComponent);
    expect(fixture.componentInstance instanceof ReviewComponent).toBe(true, 'should create ReviewComponent');

  });
});
