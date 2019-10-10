import { Component, OnInit } from '@angular/core';
import { ApiStatusCodes } from '../../../msp-core/components/confirm-template/confirm-template.component';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'msp-acl-confirmation',
  templateUrl: './acl-confirmation.component.html',
  styleUrls: ['./acl-confirmation.component.scss']
})
export class AclConfirmationComponent implements OnInit {

  confirmationNum: string;
  status: ApiStatusCodes = ApiStatusCodes.ERROR;
  message: string;

  links = environment.links;

  private _subscription: Subscription;

  constructor( private route: ActivatedRoute ) {}

  ngOnInit(): void {
    this._subscription = this.route.queryParams.subscribe(
      params => {
        if ( params['status'] ) {
          this.status = params['status'];
        }

        if ( params['confirmationNum'] ) {
          this.confirmationNum = params['confirmationNum'];
        }

        if ( params['message'] ) {
          this.message = params['message'];
        }
        console.log( 'params: ', params );
      }
    );
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  get isSucess() {
    return this.status === ApiStatusCodes.SUCCESS;
  }

  /**
   * Today's date
   * @returns {string}
   */
  get dateStamp(): string {
    return moment().format('MMMM DD, YYYY');
  }

}
