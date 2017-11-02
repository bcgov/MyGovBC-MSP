import {Component, Input } from '@angular/core';
import {Router} from '@angular/router';
import {MspProgressBarItem} from "./progressBarDataItem.model";

import { ProgressBarHelper } from '../../account/ProgressBarHelper';

@Component({
  selector: 'msp-progressBar',
  templateUrl: './progressBar.component.html',
  styleUrls: ['./progressBar.component.less']
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

  isActiveRoute(route: string):boolean {
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


  /**
   * Returns a string to be used as a CSS class, meant to provide different
   * classes for Enrollment, Premium Assistance, and Account Change
   */
  getAppTypeClass(): String {
    if (this.contains(this.router.url, "msp/application")){
      return "application";
    }
    if (this.contains(this.router.url, "msp/assistance")){
      return "assistance";
    }
    if (this.contains(this.router.url, "msp/account")){
      return "account";
    }
  }

  /**
   * Height classes should be responsive following bootstrap styles
   * 
   * todo - calculate based on PI label? use helper?
   * todo?? - don't just look at label, but also # of items
   * 
   * Need to define classes!
   */
  get heightClass(): string {
    let str: String  = this.getLongestProgressBarItemLabel();
    let length: Number;
    if (!str){ return null; }
    length = str.length;

    if (length >= 85){
      return "md-tall";
    }

    if (length >= 40 || this.hasMultiLineLabel){
      return "md-medium"
    }

    return "md-small";
  }


  private  contains(subject: string, query: string): Boolean {
    return subject.indexOf(query) >= 0;
  }

  /**
   * Returns the longest label among the progressBarList.
   */
  private getLongestProgressBarItemLabel(): String{
    if (this.progressBarList.length <= 0){
      return null;
    }

    return this.progressBarList.map(x => x.displayName)
    .sort((x, y) => {return y.length - x.length})[0];
  }

  /** At least one of the labels for the ProgressBarItems has a linebreak in it. */
  private get hasMultiLineLabel(): Boolean {
    if (this.progressBarList.length <= 0){
      return null;
    }

    return !!this.progressBarList.filter(x => { 
      return x.displayName.indexOf(ProgressBarHelper.seperator) !== -1
    }).length;
  }

}
