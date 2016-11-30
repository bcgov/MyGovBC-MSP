import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/ofObjectChanges';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';

export default class OfPropertyPathChange {
  isObject(value: any) {
    // Avoid an old bug in Chrome 19-20
    // See https://code.google.com/p/v8/issues/detail?id=2291
    const type = typeof value;
    return type === 'function' || (!!value && type === 'object');
  }

  // ofPropertyChanges(obj:any, key:string) {
  //   if (_.isObject(obj) === false) {
  //     return Observable.of(undefined);
  //   }
  //   return Observable.ofObjectChanges(obj);
  //     .filter(change: => change.name === key)
  //     .map(({ object, name }) => object[name])
  //     .startWith(obj[key]);
  // }

  // ofPropertyPathChanges(obj, path) {
  //   const parts = path.split('.');
  //   const firstKey = parts.shift();
  //   const subject = new BehaviorSubject();
    
  //   Observable.return(obj)
  //     .map(obj => ofPropertyChanges(obj, firstKey))
  //     .concat(Observable.from(parts))
  //     .reduce(
  //       (stream, key) => stream.flatMapLatest(
  //         obj => ofPropertyChanges(obj, key)
  //       )
  //     )
  //     .concatAll()
  //     .subscribe(subject);
      
  //     return subject;
  // }
}