import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AssistanceYear } from '../../models/assistance-year.model';

@Component({
  selector: 'msp-assist-cra-documents',
  template: `
    <common-page-section layout="tips">
      <ng-container *ngFor="let year of assistanceYears; index as i">
        <label>{{ year.year }}</label>
        <common-file-uploader
          instructionText="Click add or drag and drop documents"
          [images]="files(year)"
          id="{{ year.year }}"
          (imagesChange)="updateFiles($event, year)"
          required
        >
        </common-file-uploader>
        <ng-container *ngIf="touched && validFiles(year)">
          <p class="text-danger">Files are required for {{ year.year }}</p>
        </ng-container>
      </ng-container>
      <aside>
        <div class="row">
          <div class="col-2">
            <i class="fa fa-exclamation-triangle " style="font-size: 40px;"></i>
          </div>
          <p class="col-10">{{ tip1 }}</p>
        </div>

        <ul class="col-10 offset-2">
          <li class="col-12" *ngFor="let item of tipList">
            {{ item }}
          </li>
        </ul>
      </aside>
    </common-page-section>
  `,
  styleUrls: ['./assist-cra-documents.component.scss']
})
export class AssistCraDocumentsComponent implements OnInit {
  @Input() assistanceYears: AssistanceYear[];
  @Input() isSpouse = false;
  @Input() touched = false;
  @Output() dataChange: any = new EventEmitter<any>();

  tip1 = `If you are uploading a copy of a Notice of Assessment or Reassessment from the Canada Revenue Agency website, make sure the image contains:`;
  tipList = ['your name', 'the tax year', 'your net income (line 236)'];

  constructor() {}

  ngOnInit() {}
  files(year) {
    return this.isSpouse ? year.spouseFiles : year.files;
  }

  validFiles(year) {
    return this.isSpouse ? year.spouseFiles.length < 1 : year.files.length < 1;
  }

  updateFiles(arr: any, year: AssistanceYear) {
    return this.isSpouse ? (year.spouseFiles = arr) : (year.files = arr);
  }
}
