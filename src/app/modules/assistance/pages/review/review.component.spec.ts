import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AssistanceReviewComponent } from './review.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import {RouterTestingModule} from '@angular/router/testing';
import {MspLogService} from '../../../../services/log.service';
import { ModalModule } from 'ngx-bootstrap';
import {HttpClientModule} from '@angular/common/http';

describe('AssistanceReviewComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceReviewComponent],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        }),
      ModalModule.forRoot()],
      providers: [
        MspDataService,
        MspLogService
      ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(AssistanceReviewComponent);
    expect(fixture.componentInstance instanceof AssistanceReviewComponent).toBe(true, 'should create AssistanceReviewComponent');
  });
});
