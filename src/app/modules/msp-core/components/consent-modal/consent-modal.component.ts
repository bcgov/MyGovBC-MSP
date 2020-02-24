import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ConsentModalComponent } from 'moh-common-lib';

/**
 * Wrapper around common-consent-modal that contains verbage for 'Information Collection Notice"
 * modal.
 */

@Component({
    selector: 'msp-consent-modal',
    templateUrl: './consent-modal.component.html',
})
export class MspConsentModalComponent {
    
    constructor() {
        this.isMaintenanceMode = true;
    }

    @Input() isMaintenanceMode: boolean = true;
    @Input() consentProcessName: string = 'Unknown Process Name';
    @ViewChild('mspConsentModal', { static: true }) public mspConsentModal: ConsentModalComponent;

    @Output() accept: EventEmitter<any> = new EventEmitter<any>();
    @Output() close: EventEmitter<void> = new EventEmitter<void>();

    links = environment.links;

    onAccept( $event ) {
        this.accept.emit( $event );
    }

    onClose(){
        this.close.emit();
    }

    showFullSizeView() {
        this.mspConsentModal.showFullSizeView();
    }
}
