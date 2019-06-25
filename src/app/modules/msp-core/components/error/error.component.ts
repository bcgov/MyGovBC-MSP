import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

@Component({
  selector: 'msp-error',
  template: `
    <span *ngIf="touched && !valid; else elseBlock" class="text-danger"
      >{{ message }} is required</span
    >
    <ng-template #elseBlock>
      <div class="else-block"></div>
    </ng-template>
  `,
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  @Input() message = 'field';
  @Input() valid: boolean;
  @Input() touched: boolean;
  constructor() {}

  ngOnInit() {}
}
