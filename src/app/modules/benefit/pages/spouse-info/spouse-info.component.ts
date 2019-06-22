import {ChangeDetectorRef, Component, QueryList, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren} from '@angular/core';
import {ProcessService} from '../../../../services/process.service';
import {BaseComponent} from '../../../../models/base.component';
import { Router } from '@angular/router';
import {BenefitApplication} from '../../models/benefit-application.model';
import { MspBenefitDataService } from '../../services/msp-benefit-data.service';
import {Relationship} from '../../../../models/status-activities-documents';
import {NgForm} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {BenefitPersonalDetailComponent} from '../personal-info/personal-detail/personal-detail.component';
import { MspPerson } from 'app/modules/account/models/account.model';

@Component({
  selector: 'msp-spouse-info',
  templateUrl: './spouse-info.component.html',
  styleUrls: ['./spouse-info.component.scss']
})
export class BenefitSpouseInfoComponent extends BaseComponent implements OnInit {
  static ProcessStepNum = 2;
  lang = require('./i18n');
  Relationship: typeof Relationship = Relationship;
  @ViewChildren(BenefitPersonalDetailComponent) personalDetailsComponent: QueryList<BenefitPersonalDetailComponent>;
    
  public buttonClass: string = 'btn btn-primary';
  benefitApplication: BenefitApplication;

  showSpouse: boolean

  @ViewChild('formRef') personalInfoForm: NgForm;
 
  constructor(private dataService: MspBenefitDataService,
    private _router: Router,
    private cd: ChangeDetectorRef) {
    super(cd);
   this.benefitApplication = this.dataService.benefitApp;
    // if the country is blank or null or undefined then assign Canada By Default //DEF-153
    if(!this.benefitApplication.mailingAddress.country || this.benefitApplication.mailingAddress.country.trim().length === 0 ) {
       this.benefitApplication.mailingAddress.country = 'Canada';
    }
}

  ngOnInit() {
    //this.initProcessMembers(BenefitSpouseInfoComponent.ProcessStepNum, this._processService);
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
    //this._processService.setStep(2, true);
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
    console.log('remove spouse '+ event);
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
      return this.dataService.benefitApp.isUniquePhns && this.dataService.benefitApp.isUniqueSin;
  }

  get canContinue(): boolean{
    if ( this.isAllValid() && this.benefitApplication.spouse.assistYearDocs.length > 0) {
        return true;
    }
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
