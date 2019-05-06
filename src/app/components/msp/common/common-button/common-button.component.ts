import { Component, OnInit, ViewChild, EventEmitter, Input, Output, ElementRef } from '@angular/core';

@Component({
  selector: 'msp-common-button',
  templateUrl: './common-button.component.html',
  styleUrls: ['./common-button.component.scss']
})
export class CommonButtonComponent implements OnInit {
  @Input() styleClass: string;
  @Input() required: boolean = true;
  @Input() disabled: boolean = false;
  @Input() label: string = 'Default Checkbox';
  @Input() checked: boolean =  false ;
  @Output() btnClick: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('button') button: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  onClick($event) {
    this.btnClick.emit($event);
  }



}
