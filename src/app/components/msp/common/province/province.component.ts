import {Component, Input, EventEmitter, Output, ViewChild, OnInit, ChangeDetectorRef} from '@angular/core';
import {CompleterService, CompleterData} from 'ng2-completer';
import {NgForm, FormControl} from "@angular/forms";
import {BaseComponent} from "../base.component";

@Component({
  selector: 'msp-province',
  templateUrl: './province.component.html'
})

export class MspProvinceComponent extends BaseComponent implements OnInit {

  lang = require('./i18n');

  @Input() showError: boolean;
  @Input() colSize: string = "col-md-5";
  @Input() province: string;
  /**
   * Include states from USA in the list.
   */
  @Input() hideStates: boolean;
  @Input() provinceLabel: string = this.lang('./en/index.js').provinceLabel;
  @Output() onChange = new EventEmitter<any>();
  /**
   * Include countries on the list.  Essentially combines MspCountryComponent
   * with MspProvinceComponent, for the cases where both data is required on one
   * input.
   */
  @Input() showCountries: boolean = false;

  @ViewChild('formRef') form: NgForm;
  @ViewChild('provinceInput') inputField: FormControl;

  updateModel(event:string){
    this.province=event;
    this.onChange.emit(event)    
  }
  handleKeyboard(event:KeyboardEvent){
    const input = event.target as HTMLInputElement;
    if(!input.value){
      this.province = '';
    }
  }
  /**
   * Use to remove BC from the list
   * @type {boolean}
   */
  @Input() exceptBC: boolean = false;

  /**
   * Auto complete
   */
  public dataService: CompleterData;
  private provinceData = this.lang('./en/index.js').provinceData;
  private stateData = this.lang('./en/index.js').stateData;
  private countryData = this.lang('./en/index.js').countryData;

  private get provinceStateData() {
    return Array().concat(this.provinceData, this.stateData);
  }

  constructor(private completerService: CompleterService,
    private cd: ChangeDetectorRef) {
    super(cd);
  }

  ngOnInit() {
    let data = this.provinceData;
    if (this.hideStates === false) {
      data = Array().concat(data, this.stateData);
    }
    if (this.showCountries){
      data = Array().concat(data, this.countryData);
    }

    this.dataService = this.completerService.local(data, 'name', 'name');
  }
  
  
}
