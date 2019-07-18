import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private _title: BehaviorSubject<string> = new BehaviorSubject(environment.appConstants.serviceName);
  public title: Observable<string> = this._title.asObservable();
  private PREFIX = environment.appConstants.serviceName;

  constructor() { }

  setTitle(newTitle: string){
    if (newTitle.length){
      this._title.next(`${this.PREFIX} - ${newTitle}`);
    }
    else {
      this._title.next(this.PREFIX);
    }

  }
}
