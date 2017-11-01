import { ChangeDetectorRef, Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Person } from '../../../model/person.model';
import { Relationship, StatusInCanada } from '../../../model/status-activities-documents';
import { BaseComponent } from "../../../common/base.component";
import { MspToggleComponent } from '../../../common/toggle/toggle.component';
import { MspProvinceComponent } from '../../../common/province/province.component';
import { MspDateComponent } from '../../../common/date/date.component';
import { MspOutofBCRecordComponent } from '../../../common/outof-bc/outof-bc.component';
import { MspDischargeDateComponent } from '../../../common/discharge-date/discharge-date.component';


@Component({
  selector: 'msp-add-new-dependent-beneficiary',
  templateUrl: './add-new-dependent-beneficiary.component.html',
  styleUrls: ['./add-new-dependent-beneficiary.component.less']
})
export class AddNewDependentBeneficiaryComponent extends BaseComponent implements OnInit {
  Relationship: typeof Relationship = Relationship;
  StatusInCanada: typeof StatusInCanada = StatusInCanada;
  @Input() person: Person;
  @Output() onChange: EventEmitter<void> = new EventEmitter<void>();
  lang = require('./i18n');

  @ViewChildren(MspToggleComponent) toggleComponents: QueryList<MspToggleComponent>;
  @ViewChildren(MspProvinceComponent) provinceComponents: QueryList<MspProvinceComponent>;
  @ViewChildren(MspDateComponent) dateComponents: QueryList<MspDateComponent>;
  @ViewChildren(MspOutofBCRecordComponent) outOfBCComponents: QueryList<MspOutofBCRecordComponent>;
  @ViewChildren(MspDischargeDateComponent) dischargeDateComponents: QueryList<MspDischargeDateComponent>;


  constructor(cd: ChangeDetectorRef) {
    super(cd);
   }

  ngOnInit() {
  }

}
