import { Component, Inject } from '@angular/core';

@Component({
  templateUrl: './prepare.component.html'
})
export class PrepareComponent {
    staying: boolean;

    constructor(@Inject('appConstants') appConstants: Object) {
        this.staying = true;
    }

    isStaying() {
        this.staying = true;
    }
    isNotStaying() {
        this.staying = false;
    }
}