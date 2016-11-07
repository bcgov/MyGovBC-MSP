import {Component, Inject, Input} from '@angular/core';
import {Routes, Route, Router} from '@angular/router';
import {MspProgressBarItem} from "./progressBarDataItem.model";
require('./progressBar.component.less');

@Component({
  selector: 'msp-progressBar',
  templateUrl: './progressBar.component.html'
})

export class MspProgressBarComponent {
    @Input() public progressBarList: MspProgressBarItem[];

    constructor(@Inject('appConstants') appConstants: Object, public router: Router) {
    }

    isActiveRoute(route: string) {
        return this.router.isActive(route, false);
    }

    isBeforeActiveRoute(route: string) {
        var routeIndex = -1;
        var activeRouteIndex = -1;
        for(var i = 0; i < this.progressBarList.length; i++){
            if (this.progressBarList[i].routerLink === route) {
                routeIndex = i;
            }
            if (this.isActiveRoute(this.progressBarList[i].routerLink)) {
                activeRouteIndex = i;
            }
        }
        if (routeIndex < activeRouteIndex) {
            return true;
        }
        else {
            return false;
        }
    }

    isAfterActiveRoute(route: string) {
        var routeIndex = -1;
        var activeRouteIndex = -1;
        for(var i = 0; i < this.progressBarList.length; i++){
            if (this.progressBarList[i].routerLink === route) {
                routeIndex = i;
            }
            if (this.isActiveRoute(this.progressBarList[i].routerLink)) {
                activeRouteIndex = i;
            }
        }
        if (routeIndex > activeRouteIndex) {
            return true;
        }
        else {
            return false;
        }
    }
}
