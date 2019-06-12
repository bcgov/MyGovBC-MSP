import {Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription} from 'rxjs';

@Component({
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']

})
export class AssistanceConfirmationComponent {
  lang = require('./i18n');
  confirmationNum: string;
  subscription: Subscription;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.subscription = this.route.queryParams.subscribe(
      params => {
        this.confirmationNum = params['confirmationNum'];
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
