import {Component, OpaqueToken, Inject} from '@angular/core'
require('./index.less')
@Component({
  selector: 'core-header',
  templateUrl: './index.html'
})
export class CoreHeaderComponent {
  constructor(@Inject('appConstants') appConstants: Object) {
  }
}
