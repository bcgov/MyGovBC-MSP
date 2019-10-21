import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription} from 'rxjs';
import * as moment from 'moment';
import { environment } from '../../../../../environments/environment';
import { ApiStatusCodes } from 'moh-common-lib';
@Component({
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  confirmationNum: string;
  status: ApiStatusCodes = ApiStatusCodes.ERROR;
  subscription: Subscription;

  links = environment.links;

  constructor( private route: ActivatedRoute ) {}

  ngOnInit(): void {
    this.subscription = this.route.queryParams.subscribe(
      params => {
        const statusCode = params['status'];
        if ( statusCode ) {
          this.status = statusCode;
        }

        this.confirmationNum = params['confirmationNum'];

        console.log( 'params: ', params );
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
