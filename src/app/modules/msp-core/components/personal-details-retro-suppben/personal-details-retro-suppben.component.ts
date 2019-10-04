import {ChangeDetectorRef, ElementRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import {MspPerson} from '../../../../components/msp/model/msp-person.model';
import {NgForm} from '@angular/forms';
import {MspBirthDateComponent} from '../../../msp-core/components/birthdate/birthdate.component';
import {BaseComponent} from '../../../../models/base.component';
import {BenefitApplication} from '../../../benefit/models/benefit-application.model';
import {MspBenefitDataService} from '../../../benefit/services/msp-benefit-data.service';
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

    lang = require('./i18n');
    public dateLabel = 'BirthDate1';
    @Input() benefitApp: BenefitApplication;

    @Input() removeable: boolean = false;
    @Input() person: MspPerson;
   // @ViewChild('name') name: MspFullNameComponent;
    @ViewChild('formRef') personalDetailsForm: NgForm;
    @ViewChild('birthdate') birthdate: MspBirthDateComponent;
//    @ViewChild('phn') phn: PhnComponent ;

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
        return this.person.relationship === 0 ? "account holder\'s": "spouse\'s";
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

}
