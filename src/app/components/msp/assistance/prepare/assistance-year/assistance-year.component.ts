import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {AssistanceYear} from '../../../model/assistance-year.model';
import './assistance-year.component.less';

@Component({
  selector: 'msp-assistance-year',
  templateUrl: './assistance-year.component.html'
})
export class MspAssistanceYearComponent implements OnChanges{

  @Input() assistanceYear: AssistanceYear;
  @Output() updateAssistanceYear:EventEmitter<AssistanceYear> = new EventEmitter<AssistanceYear>();

  ngOnChanges(changes: SimpleChanges) {
    this.assistanceYear = new AssistanceYear();

    this.assistanceYear.apply = changes['assistanceYear'].currentValue['apply'];
    this.assistanceYear.year = changes['assistanceYear'].currentValue['year'];
    this.assistanceYear.docsRequired = changes['assistanceYear'].currentValue['docsRequired'];

  }
  
  update(value:boolean){
    this.assistanceYear.apply = value;
    this.updateAssistanceYear.emit(this.assistanceYear);
  }
}