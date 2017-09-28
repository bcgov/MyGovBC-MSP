import {Component, OpaqueToken, Inject} from '@angular/core'

import { environment } from '../../../../environments/environment';
@Component({
  selector: 'core-header',
  templateUrl: './index.html',
  styleUrls: ['./index.less']
})
export class CoreHeaderComponent {
  get serviceName(): string {
    return environment.appConstants.serviceName;
  }
}
