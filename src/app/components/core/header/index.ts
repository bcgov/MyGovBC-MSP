import {Component, OpaqueToken, Inject} from '@angular/core'
require('./index.less')
@Component({
  selector: 'core-header',
  templateUrl: './index.html'
})
export class CoreHeaderComponent {
  appConstants: Object;

  constructor(@Inject('appConstants') appConstants: Object) {
    this.appConstants = appConstants;
  }
}
