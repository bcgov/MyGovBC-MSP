import { Component, Directive, HostBinding,ElementRef,
  OnChanges, OnInit, HostListener, Input, SimpleChanges } from '@angular/core';
import moment = require("moment");

import { MspLogService } from '../../service/log.service';
import DataService from '../../service/msp-data.service';
import { LogEntry } from './log-entry.model';

@Directive({
  selector: '[mspLogger]'
})
export class MspLoggerDirective{
  /**
   * Phase of the application process
   */
  @Input() mspLogger:string;
  @Input() confirmationNumber:string;
  constructor(private logService:MspLogService, 
    private dataService:DataService,
    private el:ElementRef){

  }
  @HostListener('click', ['$event']) onclick($event:any) {
    console.log('log on click event');
    this.sendLog(this.makeGeneralLog());
  }
  @HostListener('load', ['$event']) onLoad($event:any) {
    console.log('log on load event');
    this.sendLog(this.makeGeneralLog());
  }

  makeGeneralLog():LogEntry{
    let log:LogEntry = new LogEntry();
    log.applicationId = this.dataService. getMspApplication().uuid || this.dataService.finAssistApp.uuid;
    // log.timestamp = new Date().getTime() + '';
    var now = moment();
    log.timestamp = now.toISOString();
    log.applicationPhase = this.mspLogger;
    log.refNumber = this.dataService. getMspApplication().referenceNumber;
    return log;
  }

  ngOnInit(){
    // console.log('input value: ' + this.mspLogger);
    // el.nativeElement
  }

  ngOnChanges(changes: SimpleChanges) {
    let chng = changes['confirmationNumber'];
    if(!!chng){
      let cur  = JSON.stringify(chng.currentValue);
      if(!!cur){
        // console.log('log confirmationNumber: ' + cur);
        this.sendLog(this.makeGeneralLog());
      }
    }
    // for (let propName in changes) {
    //   console.log('property name: ' + propName);
    //   let chng = changes[propName];
    //   let cur  = JSON.stringify(chng.currentValue);
    //   let prev = JSON.stringify(chng.previousValue);
    //   console.log('current value: ' + cur);
    //   console.log('previous value: ' + prev);
    // }
  }  

  private sendLog(entry:LogEntry){
    this.logService.logIt(entry).subscribe(
      (response)=>{
        // console.log('log rest service response: ');
        console.log(response);
      },
      (error)=>{
        console.log('log rest service error: ');
        console.log(error);
      },
      ()=>{
        console.log('log rest service completed!');
      }
    );

  }
}

