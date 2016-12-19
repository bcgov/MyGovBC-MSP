import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {MspProgressBarItem} from "./progressBarDataItem.model";
require('./progressBar.component.less');

@Component({
  selector: 'msp-progressBar',
  templateUrl: './progressBar.component.html'
})

export class MspProgressBarComponent {
  @Input() public progressBarList: MspProgressBarItem[];

  constructor(public router: Router) {
  }

  /**
   * Function to determine if any route in our progress bar is the current url
   * @returns {MspProgressBarItem}
   */
  isAnyRoute() {
    return this.progressBarList.find((item, index) => {
      return this.router.url == item.routerLink;
    });
  }

  isActiveRoute(route: string) {
    return this.router.isActive(route, false);
  }

  isBeforeActiveRoute(route: string) {
    let routeIndex = -1;
    let activeRouteIndex = -1;
    for (let i = 0; i < this.progressBarList.length; i++) {
      if (this.progressBarList[i].routerLink === route) {
        routeIndex = i;
      }
      if (this.isActiveRoute(this.progressBarList[i].routerLink)) {
        activeRouteIndex = i;
      }
    }
    return routeIndex < activeRouteIndex;
  }

  isAfterActiveRoute(route: string) {
    let routeIndex = -1;
    let activeRouteIndex = -1;
    for (let i = 0; i < this.progressBarList.length; i++) {
      if (this.progressBarList[i].routerLink === route) {
        routeIndex = i;
      }
      if (this.isActiveRoute(this.progressBarList[i].routerLink)) {
        activeRouteIndex = i;
      }
    }
    return routeIndex > activeRouteIndex;
  }
}
