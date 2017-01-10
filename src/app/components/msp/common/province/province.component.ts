import {Component, Input, EventEmitter, Output, ViewChild} from '@angular/core';
import {CompleterService, CompleterData} from 'ng2-completer';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'msp-province',
  templateUrl: './province.component.html'
})

export class MspProvinceComponent {

  lang = require('./i18n');

  @Input() province: string;
  @Output() provinceChange = new EventEmitter<string>();
  @Input() provinceLabel: string = this.lang('./en/index.js').provinceLabel;
  @Output() onChange = new EventEmitter<any>();
  @ViewChild('formRef') form: NgForm;
  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      this.onChange.emit(values);
    });
  }

  /**
   * Use to remove BC from the list
   * @type {boolean}
   */
  @Input() exceptBC: boolean = false;

  /**
   * Auto complete
   */
  private dataService: CompleterData;
  private provinceData = this.lang('./en/index.js').provinceData;
  private stateData = this.lang('./en/index.js').stateData;
  private get provinceStateData() {
    return Array().concat(this.provinceData, this.stateData);
  }

  getCode(name: string) {
    this.provinceData.findIndex((item:{code:string,name:string})=> {
      if (item.name ===  name) {
        return item.code;
      }
    })
  }

  constructor(private completerService: CompleterService) {

    this.dataService = completerService.local(this.provinceStateData, 'name', 'name');
  }
}
