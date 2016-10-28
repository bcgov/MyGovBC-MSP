import {Component, OpaqueToken, Inject} from '@angular/core'
require('./index.less')
@Component({
  selector: 'core-footer',
  templateUrl: './index.html'
})
export class CoreFooterComponent {
  constructor(@Inject('appConstants') appConstants: Object) {
  }
}
