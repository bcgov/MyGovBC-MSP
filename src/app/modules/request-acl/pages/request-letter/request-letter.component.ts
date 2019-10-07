import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { AbstractForm, SimpleDate } from 'moh-common-lib';
import { Router } from '@angular/router';
import { HeaderService } from '../../../../services/header.service';
import { MspConsentModalComponent } from '../../../msp-core/components/consent-modal/consent-modal.component';
import { AclDataService } from '../../services/acl-data.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { EnrolmentMembership } from '../../model/enrolment-membership.enum';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'msp-request-letter',
  templateUrl: './request-letter.component.html',
  styleUrls: ['./request-letter.component.scss']
})
export class RequestLetterComponent extends AbstractForm implements AfterViewInit, OnDestroy {

  @ViewChild('mspConsentModal') mspConsentModal: MspConsentModalComponent;

  // Used to indicate that the system is processing the request
  loading: boolean = false;
  captchaApiBaseUrl: string = environment.appConstants.captchaApiBaseUrl;
  requireAuthToken: boolean = false;

  // Radio button labels
  radioBtnLabels = [
    { label: 'Myself only', value: EnrolmentMembership.MyselfOnly },
    { label: 'All members on my MSP Account', value: EnrolmentMembership.AllMembers },
    { label: 'One specific member on my MSP Account', value: EnrolmentMembership.SpecificMember },
  ];

  private _subscription: Subscription;

  constructor( protected router: Router,
               private header: HeaderService,
               private dataService: AclDataService ) {
    super( router );

    // Set service name for application
    this.header.setTitle( 'Account Confirmation Request' );
  }

  get application() {
    return this.dataService.application;
  }

  get isSpecificMember() {
    return this.application.enrolmentMembership === EnrolmentMembership.SpecificMember;
  }

  ngAfterViewInit() {
    // Display consent modal if no agreement
    if ( !this.dataService.application.infoCollectionAgreement ) {
      this.mspConsentModal.showFullSizeView();
    }

    if ( this.form ) {
      this._subscription = this.form.valueChanges.pipe(
          debounceTime( 100 )
        ).subscribe(() => {

          // Clear out specific member PHN
          if ( !this.isSpecificMember ) {
            this.application.specificMemberPhn = '';
          }

          // Determine whether captcha is displayed or not
          if ( this.form.valid && this.dataService.application.infoCollectionAgreement ) {
            this.requireAuthToken = true;
          } else {
            this.requireAuthToken = false;
          }

          this.dataService.saveApplication();
        });
    }
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  acceptAgreement( $event ) {
    this.dataService.application.infoCollectionAgreement = $event;
    this.dataService.saveApplication();
  }


  // TODO: Build logic - add the send page data here
  continue(): void {

    if ( !this.form.valid || !this.application.authorizationToken ) {
      this.markAllInputsTouched();
      return;
    }

    console.log( 'Can continue' );
  }

}
