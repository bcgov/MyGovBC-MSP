import {Component, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef} from '@angular/core';
import {NgForm} from "@angular/forms";
/*
import {CompleterData, CompleterService} from "../../../../../../ng2-completer";
*/
import {CompleterData, CompleterService} from "ng2-completer";
import {BaseComponent} from "../base.component";

@Component({
  selector: 'msp-country',
  templateUrl: './country.component.html'
})

export class MspCountryComponent extends BaseComponent {
  lang = require('./i18n');

  /**
   * Model Inputs
   */
  @Input() showError:boolean;
  @Input() colSize: string = "col-md-5";
  @Input() label: string = this.lang('./en/index.js').countryLabel;
  @Input() country: string;
  @Output() onChange = new EventEmitter<string>();
  @ViewChild('formRef') form: NgForm;

  /**
   * Auto complete for country
   */
  public dataService: CompleterData;
  countryData:Array<{code:string, name:string}> = this.lang('./en/index.js').countryData;

  constructor(private completerService: CompleterService,
              private cd: ChangeDetectorRef) {
    super(cd);
    this.dataService = completerService.local(this.countryData, 'name', 'name');
  }

  updateModel(event:string){
    if(event){
      event = event.trim().slice(0,25);
      this.country = event;
      this.onChange.emit(event)
    }
  }
}
