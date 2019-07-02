import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'msp-common-button-group',
  templateUrl: './common-button-group.component.html',
  styleUrls: ['./common-button-group.component.scss']
})
export class CommonButtonGroupComponent implements OnInit {

  @Input() data: boolean;
  @Input() required: boolean = true;
  @Input() disabled: boolean = false;
  @Input() label: string = 'Default Checkbox';
  @Input() checked: boolean =  false ;
  @Output() dataChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('buttonGroup') buttonGroup: ElementRef;

  constructor() {

  }

  ngOnInit() {
  }

  focus() {
    this.buttonGroup.nativeElement.focus();
  }
  
  canContinue(){ // TODO: Temporary to get code to build - need to figure out where component used
    return false;
  }
}
