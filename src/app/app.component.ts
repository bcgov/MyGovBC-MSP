import {Component, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'general-app',
  templateUrl: './app.component.html'
})
export class GeneralAppComponent {
  private viewContainerRef: ViewContainerRef;

  public constructor(viewContainerRef:ViewContainerRef) {
    // You need this small hack in order to catch application root view container ref
    this.viewContainerRef = viewContainerRef;
  }  

}