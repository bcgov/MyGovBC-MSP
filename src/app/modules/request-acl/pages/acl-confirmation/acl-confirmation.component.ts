import { Component, OnInit } from '@angular/core';
import { ApiStatusCodes } from 'moh-common-lib';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { format } from 'date-fns';

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
          this.message = this.message.replace('HIBC',
                                              '<a href=\"' + this.links.HIBC + '\" target=\"blank\">Health Insurance BC</a>');
          this.message = this.message.replace('ACBC',
                                              '<a href=\"' + this.links.ACBC + '\" target=\"blank\">Change of Address Service</a>');
        }
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
    return format(new Date(), 'MMMM dd, yyyy');
  }

}
