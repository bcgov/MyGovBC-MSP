import {Component, OpaqueToken, Inject} from '@angular/core'
@Component({
  selector: 'my-app',
  templateUrl: './index.html',
  styleUrls: ['./index.less']
})
export class HomeComponent {
  constructor(@Inject('appConstants') appConstants: Object) {
  }
}
