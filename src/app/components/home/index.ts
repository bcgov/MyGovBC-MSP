import {Component, OpaqueToken, Inject} from '@angular/core'
require('./index.less')
@Component({
  selector: 'my-app',
  templateUrl: './index.html'
})
export class HomeComponent {
  constructor(@Inject('appConstants') appConstants: Object) {
  }
}
