import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef} from '@angular/core';
import {AssistanceYear} from '../../../models/assistance-year.model';

@Component({
  selector: 'msp-assistance-year',
  templateUrl: './assistance-year.component.html',
  styleUrls: ['./assistance-year.component.scss']
})
export class MspAssistanceYearComponent implements OnChanges{

  @Input() assistanceYear: AssistanceYear;
  @Output() updateAssistanceYear: EventEmitter<AssistanceYear> = new EventEmitter<AssistanceYear>();
  @ViewChild('yearInput') yearInput: ElementRef;

  ngOnChanges(changes: SimpleChanges) {
    this.assistanceYear = new AssistanceYear();

    this.assistanceYear.apply = changes['assistanceYear'].currentValue['apply'];
    this.assistanceYear.year = changes['assistanceYear'].currentValue['year'];
    this.assistanceYear.docsRequired = changes['assistanceYear'].currentValue['docsRequired'];
    this.assistanceYear.currentYear = changes['assistanceYear'].currentValue['currentYear'];

  }

  update(value: boolean){
    this.assistanceYear.apply = value;
    this.updateAssistanceYear.emit(this.assistanceYear);
  }

  focus() {
    this.yearInput.nativeElement.focus();
  }
}
