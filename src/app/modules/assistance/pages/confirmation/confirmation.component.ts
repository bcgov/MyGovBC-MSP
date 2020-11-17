import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AssistStateService } from '../../services/assist-state.service';
import { ActivatedRoute } from '@angular/router';
import { tap, map } from 'rxjs/operators';

@Component({
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class AssistanceConfirmationComponent implements OnInit {
  success: boolean;
  confirmationNum: string;
  subscription: Subscription;
  //success$: Observable<any> = this.stateSvc.success$.asObservable();
  //failure$: Observable<any> = this.stateSvc.failure$.asObservable();

  constructor(
    private stateSvc: AssistStateService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.route.params.subscribe(obj => {
      this.confirmationNum = obj.id;
      this.success = obj.status === 'SUCCESS' ? true : false;
    });
  }
}
