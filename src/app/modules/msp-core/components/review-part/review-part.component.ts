import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'msp-review-part',
  template: `
    <div class="row">
      <div class="col-6">
        <span>{{ label }}</span>
      </div>
      <div class="col-6">
        <span>{{ value }}</span>
      </div>
    </div>
  `,
  styleUrls: ['./review-part.component.scss']
})
export class ReviewPartComponent implements OnInit {
  @Input() label: string;
  @Input() value: string;

  constructor() {}

  ngOnInit() {}
}
