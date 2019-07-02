import { Component, Input, ViewChildren, ElementRef, QueryList, Renderer } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MspProgressBarItem } from './progressBarDataItem.model';
import {Subject} from 'rxjs/internal/Subject';
import {debounceTime} from 'rxjs/operators';
import { ProgressBarHelper } from '../../models/ProgressBarHelper';


@Component({
  selector: 'msp-progressBar',
  templateUrl: './progressBar.component.html',
  styleUrls: ['./progressBar.component.scss'],
})
export class MspProgressBarComponent {
  @Input() public progressBarList: MspProgressBarItem[];

  resizeEvent$: Subject<Event> = new Subject<Event>();
  /** The time in ms that must pass before the resize calculations are done. The
   * lower this number the quicker the UI will be updated,  but at a performance
   * cost.   */
  private RESIZE_DEBOUNCE_TIME = 500;
  public minimumHeight: Number;
  /** Simply call like this.unregisterResizeListener() to unregister, after it's
   * been setup. */
  private unregisterResizeListener: Function;

  @ViewChildren('links') links: QueryList<ElementRef>;

  constructor(public router: Router, private renderer: Renderer) {
    //Ensure we only process the event once every resizeThrottleTime ms.
    this.resizeEvent$.pipe(
      debounceTime(this.RESIZE_DEBOUNCE_TIME - 10))
        .subscribe(_ => {
        setTimeout(_ => {
          return this.calcualteMinHeight();
        });
      });
  }

  ngOnInit() {
    if (this.isAccountSection()) {
      this.enableResizeListener();

      //When route changes so does the displayed label
      this.router.events.subscribe(val => {
        if (val instanceof NavigationEnd) {
          setTimeout(_ => this.calcualteMinHeight());
        }
      });

    }
  }

  ngAfterViewInit() {
    if (this.isAccountSection()) {
      // Force wait one tick, avoid one time data-flow error.
      //https://angular.io/guide/component-interaction#!#parent-to-view-child
      setTimeout(() => this.calcualteMinHeight());
    }
  }

  /**
   * Make the progressBar resize it's height and do so on every resize event.
   * This event is debounced by RESIZE_DEBOUNCE_TIME.
   */
  enableResizeListener() {
    this.unregisterResizeListener = this.renderer.listenGlobal('window', 'resize', () => {
      //This anonymous function is NOT debounced, so anything done here will massively affect performance on resize.
      this.resizeEvent$.next();
    });
  }

  /**
   * Function to determine if any route in our progress bar is the current url
   * @returns {MspProgressBarItem}
   */
  isAnyRoute() {
    return this.progressBarList.find((item, index) => {
      return this.router.url === item.routerLink;
    });
  }

  isActiveRoute(route: string): boolean {
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


  /** Updates the min height of the progressBar by finding the height of the tallest element. This only affects the mobile breakpoints. */
  calcualteMinHeight(): void {
    /** Span elements are this may px smaller clientHeight than links */
    const SPAN_HEIGHT_OFFSET = 7;

    // On large breakpoints, the span's height will be 0.
    const spanHeights = this.links.toArray()
      .map(x => x.nativeElement.querySelectorAll('span')[1].clientHeight);

    this.minimumHeight = Math.max.apply(Math, spanHeights) + SPAN_HEIGHT_OFFSET;
  }

  /**
   * Returns a string to be used as a CSS class, meant to provide different
   * classes for Enrollment, Premium Assistance, and Account Change
   */
  getAppTypeClass(): String {
    if (this.contains(this.router.url, 'msp/application')) {
      return 'application';
    }
    if (this.contains(this.router.url, 'msp/assistance')) {
      return 'assistance';
    }
    if (this.contains(this.router.url, 'msp/account')) {
      return 'account';
    }
  }

  /**
   * Returns a string which matches classes found in progressBar.component.scss.
   * This class should only be responsible for the height of the progress bar
   * when it's at the -sm- breakpoint or larger in bootstrap.
   *
   * Note - A lot of this logic so far has been written with the Account
   * Maintenence section in mind.
   */
  get heightClass(): String {
    const str: String = this.getLongestProgressBarItemLabel();
    let length: Number;
    if (!str) { return null; }
    length = str.length;

    if (length >= 85) {
      return 'progressBar-lg';
    }

    if (length >= 60 && this.progressBarList.length >= 5) {
      return 'progressBar-md';
    }

    if (length >= 40 || this.hasMultiLineLabel || this.progressBarList.length >= 5) {
      return 'progressBar-sm';

    }


    return 'progressBar-xs';
  }


  private contains(subject: string, query: string): Boolean {
    return subject.indexOf(query) >= 0;
  }

  /**
   * Returns the longest label among the progressBarList.
   */
  private getLongestProgressBarItemLabel(): String {
    if (this.progressBarList.length <= 0) {
      return null;
    }

    return this.progressBarList.map(x => x.displayName)
      .sort((x, y) => { return y.length - x.length; })[0];
  }

  /**
   * At least one of the labels for the ProgressBarItems has a linebreak in it.
   * */
  private get hasMultiLineLabel(): Boolean {
    if (this.progressBarList.length <= 0) {
      return null;
    }

    return !!this.progressBarList.filter(x => {
      return x.displayName.indexOf(ProgressBarHelper.seperator) !== -1;
    }).length;
  }

  private isAccountSection(): Boolean {
    return this.getAppTypeClass() === 'account';
  }

}
