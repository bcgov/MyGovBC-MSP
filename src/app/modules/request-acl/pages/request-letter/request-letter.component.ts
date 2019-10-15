import { Component, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { AbstractForm, ApiStatusCodes } from 'moh-common-lib';
import { Router } from '@angular/router';
import { HeaderService } from '../../../../services/header.service';
import { MspConsentModalComponent } from '../../../msp-core/components/consent-modal/consent-modal.component';
import { AclDataService } from '../../services/acl-data.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { EnrolmentMembership } from '../../model/enrolment-membership.enum';
import { environment } from '../../../../../environments/environment';
import { MspLogService } from '../../../../services/log.service';
import { AclApiService } from '../../services/acl-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AclApiPayLoad } from '../../model/acl-api.model';
import { ROUTES_ACL } from '../../request-acl-route-constants';

@Component({
  selector: 'msp-request-letter',
  templateUrl: './request-letter.component.html',
  styleUrls: ['./request-letter.component.scss']
})
export class RequestLetterComponent extends AbstractForm implements OnInit, AfterViewInit, OnDestroy {

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
               private dataService: AclDataService,
               private logService: MspLogService,
               private aclApiService: AclApiService ) {
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

  ngOnInit() {
    this.logService.log( { name: 'ACL - Loaded Page', url: this.router.url},
                         'ACL - Loaded Page');
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

  continue(): void {

    if ( !this.form.valid || !this.application.authorizationToken ) {
      this.markAllInputsTouched();
      return;
    }

    this.logService.log( {name: 'ACL application submitting request'},
                         'ACL : Submission Request');

    this.loading = true;

    // Setup the request
    const subscription = this.aclApiService.sendAclRequest( this.dataService.application );

    // Trigger the HTTP request
    subscription.subscribe( response => {
      this.loading = false;
      console.log( 'request letter payload: ', response );

      // business errors.. Might be either a RAPID validation failure or DB error
      const payload: AclApiPayLoad = <AclApiPayLoad> response;
      const isSuccess =  payload.referenceNumber &&
                         payload.dberrorCode === 'Y' &&
                         payload.rapidResponse === 'Y';
      if ( isSuccess ) {

        // Successfully submitted request
        this.dataService.removeApplication();  // clear storage for application
        this.logService.log({
          name: 'ACL - Received refNo ',
          confirmationNumber: payload.referenceNumber
        }, 'ACL - Submission Response Success');

        this.navigate( ROUTES_ACL.CONFIRMATION.fullpath,
          {
            confirmationNum: payload.referenceNumber,
            status: ApiStatusCodes.SUCCESS,
          });
        return;
      }

      // TODO: Confirm whether PHN should be sent to logging
      this.logService.log( {
        name: 'ACL - RAPID/DB Error',
        confirmationNumber: this.application.uuid
      }, 'ACL - Submission Response Error' + JSON.stringify( payload ) );

      this.navigate( ROUTES_ACL.CONFIRMATION.fullpath,
        {
          status: ApiStatusCodes.ERROR
        });
    },
    (responseError) => {
      this.loading = false;
      let message = 'This error occurred because the system encountered an unanticipated situation ' +
                    'which forced it to stop.';

      // Network error
      if ( responseError instanceof HttpErrorResponse ) {

        this.application.regenUUID(); // Generates a new uuid
        this.application.authorizationToken = null;
        this.dataService.saveApplication(); // save changes

        this.logService.log({
          name: 'ACL - System Error',
          confirmationNumber: this.application.uuid
        }, 'ACL - Submission Response Error' + responseError.message );
        message = 'Try to submit your MSP Account Confirmation request again.';
      }
      this.navigate( ROUTES_ACL.CONFIRMATION.fullpath,
        {
          status: ApiStatusCodes.ERROR,
          message: message
        });
    });

  }
}
