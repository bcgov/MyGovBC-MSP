import { Injectable } from '@angular/core';
import { Route } from '@angular/router';


// Interface for the Page Llist
export interface PageList {
  index: number;
  path: string;
  fullpath: string;
  isComplete: boolean;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class PageStateService {

  constructor() { }

  setPages(arr: Route[], routeListConst: any, pageList: PageList[] ): PageList[] {

    if ( !pageList.length ) {
      const routeConst = Object.keys( routeListConst ).map( x => routeListConst[x] );

      return arr.filter((itm: any) => !itm.redirectTo)
        .map((itm: any) => {
          const val = routeConst.find( x => x.path === itm.path );
          return {
            index: val.index,
            path: val.path,
            fullpath: val.fullpath,
            isComplete: false,
          };
        });
    }
    return pageList;
  }

  findIndex( url: string, pageStatus: PageList[] ): number {
    let idx = 0;
    if ( pageStatus ) {
      const obj = pageStatus.find( x => url.includes(x.path) );
      if ( obj ) {
        idx = obj.index;
      }
    }
    return idx;
  }

  setPageIncomplete( path: string, pageStatus: PageList[] ) {
    const obj = pageStatus.find( x => path.includes(x.path) );
    if ( obj ) {
      obj.isComplete = false;
      // Set future pages to not complete
      pageStatus.map( x => {
        if ( obj.index < x.index && x.isComplete ) {
          x.isComplete = false;
        }
      });
    }
  }

  setPageComplete( path: string, pageStatus: PageList[] ) {
    const obj = pageStatus.find( x => path.includes(x.path) );
    if ( obj ) {
      obj.isComplete = true;
    }
  }

  isPageComplete( path: string, pageStatus: PageList[] ): boolean {
    let complete = false;
    const obj = pageStatus .find( x => path.includes(x.path) );
    if ( obj ) {
      // Requirement to continue is the previous page is complete
      const prevIdx = obj.index - 1;
      complete = (prevIdx === 0 ? obj.isComplete : pageStatus[prevIdx - 1].isComplete );
    }
    return complete;
  }

  clearCompletePages( pageStatus: PageList[] ) {
    pageStatus.map( x => {
        x.isComplete = false;
    });
  }
}
