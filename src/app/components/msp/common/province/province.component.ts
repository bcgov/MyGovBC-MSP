import {Component, Input, EventEmitter, Output, ViewChild, OnDestroy} from '@angular/core';
import {CompleterService, CompleterData} from 'ng2-completer';
import {NgForm, FormControl} from "@angular/forms";

@Component({
  selector: 'msp-province',
  templateUrl: './province.component.html'
})

export class MspProvinceComponent implements OnDestroy {

  lang = require('./i18n');

  @Input() showError: boolean;
  @Input() colSize: string = "col-sm-5";
  @Input() province: string;
  @Input() provinceLabel: string = this.lang('./en/index.js').provinceLabel;
  @Output() onChange = new EventEmitter<any>();

  @Output() isFormValid = new EventEmitter<boolean>();
  @Output() registerComponent = new EventEmitter<MspProvinceComponent>();
  @Output() unRegisterComponent = new EventEmitter<MspProvinceComponent>();

  @ViewChild('formRef') form: NgForm;
  @ViewChild('provinceInput') inputField: FormControl;

  ngAfterViewInit(): void {
    this.registerComponent.emit(this);
    this.isFormValid.emit(!!this.province);
    this.form.valueChanges.subscribe( values => {
      this.isFormValid.emit(!!this.province);
    });
  }
  
  updateModel(event:string){
    this.province=event;
    this.onChange.emit(event)    
    this.isFormValid.emit(!!event);
  }
  handleKeyboard(event:KeyboardEvent){
    const input = event.target as HTMLInputElement;
    if(!input.value){
      this.province = '';
      this.isFormValid.emit(!!this.province);
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
  private dataService: CompleterData;
  private provinceData = this.lang('./en/index.js').provinceData;
  private stateData = this.lang('./en/index.js').stateData;
  private get provinceStateData() {
    return Array().concat(this.provinceData, this.stateData);
  }

  constructor(private completerService: CompleterService) {

    this.dataService = completerService.local(this.provinceStateData, 'name', 'name');
  }

  ngOnDestroy(){
    this.unRegisterComponent.emit(this);
  }
}
