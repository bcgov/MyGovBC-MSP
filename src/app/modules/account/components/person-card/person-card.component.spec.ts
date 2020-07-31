import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AccountPersonCardComponent } from './person-card.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import {ModalModule} from 'ngx-bootstrap';
import {RouterTestingModule} from '@angular/router/testing';
import { MspCoreModule } from '../../../msp-core/msp-core.module';

describe('MspPersonCardComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountPersonCardComponent],
      imports: [
        FormsModule,
        ModalModule.forRoot(),
        RouterTestingModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        }),
        MspCoreModule
      ],
      providers: [MspDataService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(AccountPersonCardComponent);
    expect(fixture.componentInstance instanceof AccountPersonCardComponent).toBe(true, 'should create MspPersonCardComponent');
  });
});
