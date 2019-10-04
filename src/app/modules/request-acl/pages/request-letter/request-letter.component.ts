import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { AbstractForm } from 'moh-common-lib';
import { Router } from '@angular/router';
import { HeaderService } from '../../../../services/header.service';
import { MspConsentModalComponent } from '../../../msp-core/components/consent-modal/consent-modal.component';
import { AclDataService } from '../../services/acl-data.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'msp-request-letter',
  templateUrl: './request-letter.component.html',
  styleUrls: ['./request-letter.component.scss']
})
export class RequestLetterComponent extends AbstractForm implements AfterViewInit, OnDestroy {

  @ViewChild('mspConsentModal') mspConsentModal: MspConsentModalComponent;

  // Used to indicate that the system is processing the request
  loading: boolean = false;

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

  ngAfterViewInit() {
    // Display consent modal if no agreement
    if ( !this.dataService.application.infoCollectionAgreement ) {
      this.mspConsentModal.showFullSizeView();
    }

    if ( this.form ) {
      console.log( 'subscribe to form changes' );
      this._subscription = this.form.valueChanges.pipe(
          debounceTime( 100 )
        ).subscribe(() => {
          this.dataService.saveApplication();
        });
    }
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  acceptAgreement( $event ) {
    console.log( 'accept agreement ', $event );
    this.dataService.application.infoCollectionAgreement = $event;
    this.dataService.saveApplication();
  }


  // TODO: Build logic - add the send page data here
  continue(): void {

  }

}
