import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';


// TODO: To replace review-card-wrapper - this component has the 'edit' by the icon
// This component was created so existing applications are not impacted by change, automate tests
// might be impacted by html change
@Component({
  selector: 'msp-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss']
})
export class ReviewCardComponent {

  @Input() editRouterLink: string;
  @Input() title: string;
  @Input() wordByIcon: boolean = true;

  constructor( private _router: Router ) {
   }

  editPersonalInfo() {

    // Check that link exists
    if ( this.editRouterLink ) {
      this._router.navigate([this.editRouterLink]);
    }
  }
}
