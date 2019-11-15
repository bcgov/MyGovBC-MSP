import {ChangeDetectorRef, ElementRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import {MspPerson} from '../../../../components/msp/model/msp-person.model';
import {NgForm} from '@angular/forms';
import {BaseComponent} from '../../../../models/base.component';
import {BenefitApplication} from '../../models/benefit-application.model';
import {MspBenefitDataService} from '../../services/msp-benefit-data.service';
import { Subscription, Observable, of } from 'rxjs';
import {MspImageErrorModalComponent} from '../../../msp-core/components/image-error-modal/image-error-modal.component';
import { CommonImage } from 'moh-common-lib';
import { Relationship } from '../../../../models/relationship.enum';
@Component({
  selector: 'msp-personal-details-retro-suppben',
  templateUrl: './personal-details-retro-suppben.component.html',
  styleUrls: ['./personal-details-retro-suppben.component.scss']
})
export class PersonalDetailsRetroSuppbenComponent extends BaseComponent  {

    @Input() benefitApp: BenefitApplication;

    @Input() removeable: boolean = false;
    @Input() person: MspPerson;
    @ViewChild('formRef') personalDetailsForm: NgForm;
    @Output() onChange = new EventEmitter<any>();
    @Output() docActionEvent = new EventEmitter<any>();
    @Output() notifySpouseRemoval: EventEmitter<MspPerson> = new EventEmitter<MspPerson>();
    @ViewChild('mspImageErrorModal') mspImageErrorModal: MspImageErrorModalComponent;
    subscriptions: Subscription[];



    constructor(private dataService: MspBenefitDataService,
                private cd: ChangeDetectorRef) {
        super(cd);
        this.benefitApp = this.dataService.benefitApp;
        this.person = this.dataService.benefitApp.applicant;
        // console.log(this.person);
    }

    ngAfterViewInit() {
        //console.log(this.birthdate);
        this.personalDetailsForm.valueChanges.pipe(debounceTime(0))
            .subscribe( values => {
                this.onChange.emit(values);
                //this.dataService.saveBenefitApplication();
            });
    //    this.dataService.saveBenefitApplication();
    }

    get docText(): string {
        return this.person.relationship === 0 ? 'account holder\'s' : 'spouse\'s';
    }


    isSinUnique(): boolean {
        return this.benefitApp.isUniqueSin;
    }

    isPhnUnique() {
        return this.benefitApp.isUniquePhns;
    }


    removeSpouse(): void {
        this.notifySpouseRemoval.emit(this.person);
        this.dataService.benefitApp.setSpouse = false;
        this.person = new MspPerson(Relationship.Spouse);
    }

    errorDoc(evt: CommonImage) {
        this.mspImageErrorModal.imageWithError = evt;
        this.mspImageErrorModal.showFullSizeView();
        this.mspImageErrorModal.forceRender();
        this.docActionEvent.emit(evt);
    }

    addDocument(evt: Array<any>) {
        console.log('evt', evt);
        this.person.assistYearDocs = evt;
        this.dataService.saveBenefitApplication();
        // this.person.documents.images = this.person.documents.images.filter(
        //   (mspImage: MspImage) => {
        //     return evt.uuid !== mspImage.uuid;
        //   }
        // );
        this.docActionEvent.emit(evt);
        this.onChange.emit(evt);
      }

  get phnList() {
    if ( this.person.relationship === Relationship.Spouse ) {
      return [this.dataService.benefitApp.applicant.previous_phn];
    }
    return [this.dataService.benefitApp.spouse.previous_phn];
  }

  get sinList() {
    if ( this.person.relationship === Relationship.Spouse ) {
      return [this.dataService.benefitApp.applicant.sin];
    }
    return [this.dataService.benefitApp.spouse.sin];
  }
}
