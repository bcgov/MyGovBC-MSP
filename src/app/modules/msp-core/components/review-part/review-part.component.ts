import { Component, OnInit, Input } from '@angular/core';

export interface ColumnClass {
  label: string;
  value: string;
}

@Component({
  selector: 'msp-review-part',
  template: `
    <div class="row">
      <div class="{{_defaultColumnClass.label}}">
        <span>{{ label }}</span>
      </div>
      <div class="{{_defaultColumnClass.value}}">
        <span *ngIf="value; else ValueHtml;">{{ value }}</span>
      </div>
    </div>

    <ng-template #ValueHtml>>
      <ng-content></ng-content>
    </ng-template>
  `,
  styleUrls: ['./review-part.component.scss']
})
export class ReviewPartComponent implements OnInit {
  @Input() label: string;
  @Input() value: string;
  @Input() columnClass: ColumnClass;

  _defaultColumnClass: ColumnClass = {label: 'col-6', value: 'col-6'};

  constructor() {}

  ngOnInit() {
    if (this.columnClass) {
      Object.keys(this.columnClass).map(x => this._defaultColumnClass[x] = this.columnClass[x]);
    }
  }
}
