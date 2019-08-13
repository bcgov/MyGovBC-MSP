import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'msp-review-card-wrapper',
  template: `
    <h2>
      {{ title }}
      <i
        class="fa fa-pencil edit--icon float-right"
        aria-hidden="true"
        (click)="router.navigate([link])"
      ></i>
    </h2>
    <div class="card">
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./review-card-wrapper.component.scss']
})
export class ReviewCardWrapperComponent implements OnInit {
  @Input() title: string;
  @Input() link: string;

  constructor(public router: Router) {}

  ngOnInit() {}
}
