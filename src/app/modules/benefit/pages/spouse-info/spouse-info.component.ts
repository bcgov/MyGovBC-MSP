import {ChangeDetectorRef, Component, QueryList, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren} from '@angular/core';
import {ProcessService} from '../../../../services/process.service';
import {BaseComponent} from '../../../../models/base.component';
import { Router } from '@angular/router';
import {BenefitApplication} from '../../models/benefit-application.model';
import {PersonalDetailsRetroSuppbenComponent} from '../../../msp-core/components/personal-details-retro-suppben/personal-details-retro-suppben.component';
import { MspBenefitDataService } from '../../services/msp-benefit-data.service';
import {Relationship} from '../../../../models/status-activities-documents';
import {NgForm} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { validatePHN } from 'app/modules/msp-core/models/validate-phn';

@Component({
  selector: 'msp-spouse-info',
  templateUrl: './spouse-info.component.html',
  styleUrls: ['./spouse-info.component.scss']
})
export class BenefitSpouseInfoComponent extends BaseComponent implements OnInit {
  static ProcessStepNum = 2;
  lang = require('./i18n');
  Relationship: typeof Relationship = Relationship;
  //@ViewChildren(BenefitPersonalDetailComponent) personalDetailsComponent: QueryList<BenefitPersonalDetailComponent>;
  @ViewChildren(PersonalDetailsRetroSuppbenComponent) personalDetailsComponent: QueryList<PersonalDetailsRetroSuppbenComponent>;

  benefitApplication: BenefitApplication;

  showSpouse: boolean;

  @ViewChild('formRef') personalInfoForm: NgForm;

  constructor(private dataService: MspBenefitDataService,
    private _router: Router, private _processService: ProcessService,
    private cd: ChangeDetectorRef) {
    super(cd);
   this.benefitApplication = this.dataService.benefitApp;
    // if the country is blank or null or undefined then assign Canada By Default //DEF-153
    if (!this.benefitApplication.mailingAddress.country || this.benefitApplication.mailingAddress.country.trim().length === 0 ) {
       this.benefitApplication.mailingAddress.country = 'Canada';
    }
}

  ngOnInit() {
    
    this.initProcessMembers(BenefitSpouseInfoComponent.ProcessStepNum, this._processService);
    this._processService.setStep(BenefitSpouseInfoComponent.ProcessStepNum, false);
    
  }

  ngAfterViewInit() {
    this.personalInfoForm.valueChanges.pipe(
        debounceTime(250),
        distinctUntilChanged()
    ).subscribe( values => {
        this.dataService.saveBenefitApplication();
    });
  }

  nextStep(){
    this._processService.setStep(BenefitSpouseInfoComponent.ProcessStepNum, true);
    this._router.navigate(['/benefit/contact-info']);

  }

  addSpouse = () => {
   //this.benefitApplication.applicant = new MspPerson(Relationship.Spouse);
   this.showSpouse = true;
  //  this.benefitApplication.hasSpouseOrCommonLaw = true;
    this.dataService.benefitApp.setSpouse = true;
    //this.dataService.benefitApp.hasSpouseOrCommonLaw = true
    //console.log(this.benefitApplication.hasSpouseOrCommonLaw);
    // const sp: MspPerson = new MspPerson(Relationship.Spouse);
   // this.dataService.getMspApplication().addSpouse(sp);
  }

  removeSpouse(event: Object): void{
   // console.log('remove spouse ', event);
   // this.dataService.getMspApplication().removeSpouse();
    this.showSpouse = false;
   // this.dataService.benefitApp.setSpouse = false;
    //this.dataService.saveMspApplication();
  }

  onChange(values: any) {
    this.dataService.saveBenefitApplication();
  }

  onSubmit(form: NgForm){
      this._router.navigate(['/msp/benefit/documents']);
  }

  isValid(): boolean {
      return this.dataService.benefitApp.isUniquePhns && this.dataService.benefitApp.isUniqueSin && validatePHN(this.dataService.benefitApp.spouse.previous_phn);
  }

  get canContinue(): boolean{
    if (!this.benefitApplication.hasSpouseOrCommonLaw) {
      //this._processService.setStep(BenefitSpouseInfoComponent.ProcessStepNum, true);
      return true;
    } else {
      if ( this.isAllValid() && this.benefitApplication.hasSpouseOrCommonLaw && this.benefitApplication.spouse.assistYearDocs.length > 0) {
        //this._processService.setStep(BenefitSpouseInfoComponent.ProcessStepNum, true);
        return true;
      }
    }
    this._processService.setStep(BenefitSpouseInfoComponent.ProcessStepNum, false);
    return  false;
  }

  /*get application(): BenefitApplication {
    return this.dataService.get ;
  }
  get applicant(): MspPerson {
    return this.dataService.getMspApplication().applicant;
  }

  get spouse(): MspPerson {
    return this.dataService.getMspApplication().spouse;
  }

  onChange(values: any){
    this.dataService.saveMspApplication();
  }

  documentsReady(): boolean {
    return this.dataService.getMspApplication().spouseDocumentsReady;
  }

  checkAnyDependentsIneligible(): boolean {
    const target = [this.dataService.getMspApplication().applicant, this.dataService.getMspApplication().spouse , ...this.dataService.getMspApplication().children];
    return target.filter(x => x)
        .filter(x => x.ineligibleForMSP).length >= 1;
  }

  */

}
