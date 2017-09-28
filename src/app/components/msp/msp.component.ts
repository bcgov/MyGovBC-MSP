import { Component,ViewContainerRef } from '@angular/core';

@Component({
  selector: 'msp-app',
  templateUrl: './msp.component.html',
  styleUrls: ['./msp.component.less']
})
export class MspComponent {
  private viewContainerRef: ViewContainerRef;

  public constructor(viewContainerRef:ViewContainerRef) {
    // You need this small hack in order to catch application root view container ref
    this.viewContainerRef = viewContainerRef;
  }  

}