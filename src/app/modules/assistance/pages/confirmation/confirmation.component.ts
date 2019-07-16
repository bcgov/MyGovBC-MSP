import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AssistStateService } from '../../services/assist-state.service';
import { ActivatedRoute } from '@angular/router';
import { tap, map } from 'rxjs/operators';

@Component({
  template: `
    <ng-container *ngIf="success">
      <!-- SUCCESS: {{ success$ | async | json }} -->
      <msp-confirmation
        [success]="true"
        [confirmationNum]="confirmationNum"
        message="Your application has been successfully submitted"
      >
      </msp-confirmation>
    </ng-container>

    <ng-container *ngIf="!success">
      <!-- FAILURE: {{ failure$ | async | json }} -->

      <msp-confirmation
        [success]="false"
        title="There was a technical issue with your submission."
        message="Your application has not been submitted"
      ></msp-confirmation>
    </ng-container>
  `,
  styleUrls: ['./confirmation.component.scss']
})
export class AssistanceConfirmationComponent implements OnInit {
  success: boolean;
  confirmationNum: string;
  subscription: Subscription;
  success$: Observable<any> = this.stateSvc.success$.asObservable();
  failure$: Observable<any> = this.stateSvc.failure$.asObservable();

  constructor(
    private stateSvc: AssistStateService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.route.params.subscribe(obj => {
      this.confirmationNum = obj.id;
      this.success = obj.successs === 'SUCCESS';
    });
  }
}
