import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { NgForm } from '@angular/forms';
import { BaseComponent } from '../../../../models/base.component';
import { BenefitApplication } from '../../models/benefit-application.model';
import { MspBenefitDataService } from '../../services/msp-benefit-data.service';
import { Subscription } from 'rxjs';
import { MspImageErrorModalComponent } from '../../../msp-core/components/image-error-modal/image-error-modal.component';
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

  Relationship = Relationship;
  subscriptions: Subscription[];
  supportDocErrorMsg: string = '';

  constructor(private dataService: MspBenefitDataService,
              private cd: ChangeDetectorRef) {
    super(cd);
    this.benefitApp = this.dataService.benefitApp;
    this.person = this.dataService.benefitApp.applicant;
  }

  ngAfterViewInit() {
    this.personalDetailsForm.valueChanges.pipe(debounceTime(0))
        .subscribe( values => {
            this.onChange.emit(values);
        });
  }

  get docText(): string {
    return this.person.relationship === Relationship.Applicant ? 'your' : 'your spouse\'s';
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

  // Check the collective size, triggered whenever an image is added or removed
  handleImagesChange(imgs: Array<CommonImage>) {
    let sum = 0;
    let tooSmall = false;
    this.person.assistYearDocs = imgs;

    imgs.forEach(img => { 
      if (typeof img.size === 'number') {
        sum += img.size;
      }

      if (img.size < 20000) {
        this.person.assistYearDocs.pop();
        tooSmall = true;
      }
    });
    
    // Same limit as moh-common-lib
    if (sum > 1048576) {
      // Reset the attachments for this upload
      this.person.assistYearDocs = [];
      this.supportDocErrorMsg = 'The addition of the previous document exceeded the maximum upload size of this supporting document section.';
    } else if (tooSmall) {
      this.supportDocErrorMsg = 'The document you attempted to upload is too small. Please try again with a larger, higher quality file.';
    } else {
      this.supportDocErrorMsg = '';
    }

    this.dataService.saveBenefitApplication();
  }
}
