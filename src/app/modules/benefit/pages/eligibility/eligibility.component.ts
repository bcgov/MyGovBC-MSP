import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../../models/base.component';
import {BenefitApplication} from '../../models/benefit-application.model';
import {MspBenefitDataService} from '../../services/msp-benefit-data.service';
import * as _ from 'lodash';
import {ConsentModalComponent} from 'moh-common-lib';
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
