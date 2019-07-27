import {ChangeDetectorRef, Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../models/base.component';
import {BenefitApplication} from '../../models/benefit-application.model';
import {MspBenefitDataService} from '../../services/msp-benefit-data.service';
import {debounceTime, distinctUntilChanged, filter, map, tap} from 'rxjs/operators';
import {MspImageErrorModalComponent} from '../../../msp-core/components/image-error-modal/image-error-modal.component';
import {ModalDirective} from 'ngx-bootstrap';
import {NgForm} from '@angular/forms';
import {MspImage} from '../../../../models/msp-image';
import {AssistanceYear} from '../../../assistance/models/assistance-year.model';
import {merge} from 'rxjs/internal/observable/merge';
import * as _ from 'lodash';
import {ConsentModalComponent} from 'moh-common-lib';
import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {CommonDeductionCalculatorComponent} from '../../../msp-core/components/common-deduction-calculator/common-deduction-calculator.component';
//import moment = require('moment');
import * as moment from 'moment';
import {Router} from '@angular/router';

@Component({
  selector: 'msp-eligibility',
  templateUrl: './eligibility.component.html',
  styleUrls: ['./eligibility.component.scss']
})
export class EligibilityComponent extends BaseComponent {

  continue: boolean;

  @ViewChild('mspConsentModal') mspConsentModal: ConsentModalComponent;

  constructor(private _router: Router, public dataService: MspBenefitDataService , cd: ChangeDetectorRef) {
                super(cd);
                
  }

  ngAfterViewInit() {
    if (!this.dataService.benefitApp.infoCollectionAgreement) {
        this.mspConsentModal.showFullSizeView();
    }
  }

  spaEnvCutOffDate(evt: any){
    this.benefitApp.spaEnvRes = evt;
  }

  navigate() {
    if (this.dataService.benefitApp.isEligible) {
      this._router.navigate(['/benefit/financial-info']);
    } else {
      this._router.navigate(['/benefit/confirmation']);
    }
  }

  get benefitApp(): BenefitApplication {
    return this.dataService.benefitApp;
  }
}
