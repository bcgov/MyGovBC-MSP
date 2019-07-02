import {ChangeDetectorRef, ElementRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import {MspPerson} from '../../../../components/msp/model/msp-person.model';
import {NgForm} from '@angular/forms';
import {MspBirthDateComponent} from '../../../msp-core/components/birthdate/birthdate.component';
import {BaseComponent} from '../../../../models/base.component';
import {BenefitApplication} from '../../models/benefit-application.model';
import {MspBenefitDataService} from '../../services/msp-benefit-data.service';
import {MspImage} from '../../../../models/msp-image';
import { Subscription, Observable, of } from 'rxjs';
import {MspImageErrorModalComponent} from '../../../msp-core/components/image-error-modal/image-error-modal.component';
import {Relationship, StatusInCanada} from '../../../../models/status-activities-documents';


@Component({
  selector: 'msp-benefit-personal-detail',
  templateUrl: './personal-detail.component.html',
  styleUrls: ['./personal-detail.component.scss']
})
export class BenefitPersonalDetailComponent extends BaseComponent {

    lang = require('./i18n');
    public dateLabel = 'BirthDate1';
    public benefitApp: BenefitApplication;

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
        console.log(this.person);
    }

    ngAfterViewInit() {
        console.log(this.birthdate);
        this.personalDetailsForm.valueChanges.pipe(debounceTime(0))
            .subscribe( values => {
                console.log(values);
                this.onChange.emit(values);
                console.log(this.person);
                
                //this.dataService.saveBenefitApplication();
            });
    //    this.dataService.saveBenefitApplication();
    }

   

    isSinUnique(): boolean {
        return this.dataService.benefitApp.isUniqueSin;
    }

    isPhnUnique() {
        console.log('Unique phn: '+this.dataService.benefitApp.isUniquePhns);
        return this.dataService.benefitApp.isUniquePhns;
    }

    removeSpouse(): void {
        this.notifySpouseRemoval.emit(this.person);
        this.dataService.benefitApp.setSpouse = false;
        //this.person = new MspPerson(Relationship.Spouse);
    }

    errorDoc(evt: MspImage) {
        this.mspImageErrorModal.imageWithError = evt;
        this.mspImageErrorModal.showFullSizeView();
        this.mspImageErrorModal.forceRender();
        this.docActionEvent.emit(evt);
    }

    /*
    checkPhnValid(evt: any){
        console.log(evt);
        /*this.subscriptions.push( parent.statusChanges.subscribe( x => {
            console.log( '(full-name) parent change status: ', parent.status );
          }) );
    }
    deleteDoc(doc: MspImage){
        //this.person.assistYeaDocs = this.benefitApp.assistYeaDocs;
       // console.log('****'+doc);
        this.benefitApp.assistYearDocs = this.benefitApp.assistYearDocs
            .filter( d => {
                return d.id !== doc.id;
            });
        this.dataService.saveBenefitApplication();
        this.docActionEvent.emit(doc);
    }*/
    /*  getSinList(): string[]{
        return this.benefitApp.allPersons.map(x => x.sin);
    }*/
    /*addDoc(doc: MspImage){
        //this.benefitApp.assistYeaDocs = this.person.assistYeaDocs;
        this.benefitApp.assistYearDocs = this.benefitApp.assistYearDocs.concat(doc);
        
       // this.fileUploader.forceRender();
        this.dataService.saveBenefitApplication();
        this.docActionEvent.emit(doc);

    }*/

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
