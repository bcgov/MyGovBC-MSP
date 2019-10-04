import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable({
  providedIn: 'root'
})
export class BaseMspDataService {

  constructor( protected localStorageService: LocalStorageService ) { }

  /** Storage methods */
  protected destroyAll() {
    this.localStorageService.clearAll();
  }

  // TODO: Added storage for pages
}

