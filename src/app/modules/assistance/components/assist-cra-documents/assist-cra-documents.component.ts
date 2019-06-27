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
        >
        </common-file-uploader>
      </ng-container>
      <aside>
        <div class="row">
          <div class="col-4">
            <i class="fa fa-exclamation-triangle" style="font-size: 40px;"></i>
          </div>
        </div>
        <div class="row">
          <p class="col-12">{{ tip1 }}</p>
        </div>
        <br />
        <div class="row">
          <p class="col-12">{{ tip2 }}</p>
          <p class="col-12">Make sure that it's:</p>
          <ul class="col-12">
            <li class="col-12" *ngFor="let item of tipList">{{ item }}</li>
          </ul>
        </div>
      </aside>
    </common-page-section>
  `,
  styleUrls: ['./assist-cra-documents.component.scss']
})
export class AssistCraDocumentsComponent implements OnInit {
  @Input() assistanceYears: AssistanceYear[];
  @Input() isSpouse = false;
  @Output() dataChange: any = new EventEmitter<any>();

  tip1 =
    'If you are uploading a copy of a NOA/NORA printed from the CRA website, ensure that the applicable name, tax year and tax return line 236 (net income) are included on the copy.';
  tip2 = `Scan the document, or take a photo of it.`;
  tipList = [
    'The entire document, from corner to corner',
    'At least 1000 pixels wide x 1500 pixels tall',
    'Rotate correctly (not upside down or sideways)',
    'In focus and easy to read',
    'A JPG, PNHG, GIF, BMP or PDF'
  ];

  constructor() {}

  ngOnInit() {}
  files(year) {
    return this.isSpouse ? year.spouseFiles : year.files;
  }

  updateFiles(arr: any, year: AssistanceYear) {
    return this.isSpouse ? (year.spouseFiles = arr) : (year.files = arr);
  }
}
