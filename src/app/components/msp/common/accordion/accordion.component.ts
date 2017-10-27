import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AccordionConfig } from 'ngx-bootstrap/accordion';

@Component({
  selector: 'msp-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.less'],
  //Enables us to style the embedded component from ngx-bootstrap
  encapsulation: ViewEncapsulation.None
})
export class MspAccordionComponent implements OnInit {

  lang = require('./i18n');
  @Input() title: string;
  @Input() isOpen: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
