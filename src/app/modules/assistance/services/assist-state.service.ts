import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssistStateService {
  touched: Subject<boolean> = new Subject<boolean>();

  constructor() {}
}
