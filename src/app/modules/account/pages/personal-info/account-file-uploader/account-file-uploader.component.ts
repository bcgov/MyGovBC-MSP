import {Component, Input } from '@angular/core';
import { MspPerson } from '../../../models/account.model';
import { MspAccountApp } from '../../../models/account.model';



@Component({
  selector: 'msp-account-file-uploader',
  templateUrl: './account-file-uploader.component.html',
  styleUrls: ['./account-file-uploader.component.scss']
})


export class AccountFileUploaderComponent  {

  @Input() title: string;
  @Input() subtitle: string;
  docSelected: string;
  @Input() person: MspPerson;
  @Input() activitiesTable: any[];
  @Input() items: string[];
  @Input() accountApp: MspAccountApp;

  constructor() {

    console.log(this.person);
   }

  ngOnInit() {
  }

  remove() {
    this.docSelected = null;
  }

}
