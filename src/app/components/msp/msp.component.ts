import { Component,ViewContainerRef } from '@angular/core';
require('./msp.component.less')

@Component({
  selector: 'msp-app',
  templateUrl: './msp.component.html'
})
export class MspComponent {
  private viewContainerRef: ViewContainerRef;

  public constructor(viewContainerRef:ViewContainerRef) {
    // You need this small hack in order to catch application root view container ref
    this.viewContainerRef = viewContainerRef;
  }  

}