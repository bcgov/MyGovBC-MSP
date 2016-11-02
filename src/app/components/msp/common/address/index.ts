import {Component, OpaqueToken, Inject} from '@angular/core'
require('./index.less')
@Component({
  selector: 'msp-address',
  templateUrl: './index.html'
})
export class MspAddressComponent {
  constructor(@Inject('appConstants') appConstants: Object) {
  }
}
