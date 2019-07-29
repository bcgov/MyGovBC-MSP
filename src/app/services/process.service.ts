import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import { MspDataService } from './msp-data.service';
import { Container, CheckCompleteBaseService, RouteGuardService, AbstractPgCheckService } from 'moh-common-lib';
import { environment } from 'environments/environment';


export class ProcessUrls {
    public static readonly ACCOUNT_PREPARE_URL = '/account/prepare' ;
    public static readonly ACCOUNT_FILE_UPLOADER_URL = '/account/documents' ;
    public static readonly ACCOUNT_REVIEW_URL = '/account/review' ;
    public static readonly ACCOUNT_PERSONAL_INFO_URL = '/account/personal-info' ;
    public static readonly ACCOUNT_DEPENDENTS_URL = '/account/dependent-change' ;
    public static readonly ACCOUNT_SENDING_URL = '/account/sending' ;
    public static readonly ACCOUNT_SPOUSE_INFO_URL = '/account/spouse-info' ;
    public static readonly ACCOUNT_CHILD_INFO_URL = '/account/child-info' ;


}

export class Process {
    processSteps: ProcessStep[];
}

export class ProcessStep {
    route: string;
    complete: boolean = false;

    constructor(route: string) {
        this.route = route;
    }
}

@Injectable()
export class ProcessService extends CheckCompleteBaseService implements CanActivate {

    constructor(private dataService: MspDataService,
                private _router: Router) {
                    super(_router);
    }

    get process(): Process {
        return this.dataService.getMspProcess();

    }

    init(processSteps: ProcessStep[]): void {
        console.log('init');
        const process = new Process();
        process.processSteps = processSteps;
        this.dataService.setMspProcess(process);
    }

    setStep(stepNumber: number, complete: boolean) {
        console.log('set step');
        
        const process = this.process;
        process.processSteps[stepNumber].complete = complete;
        this.dataService.setMspProcess(process);
       // console.log('ProcessService is being deprecated.');
       // return null;
    }

    getNextStep(stepNumber: number): String {
        const process = this.process;
        return process.processSteps[stepNumber + 1].route;
    }

   /* getNextStep(): String {
        return this.getFirstFalseStep().route;
    }*/
    //used to find the next step to navigate to when steps are defined at runtime
    getFirstFalseStep(): ProcessStep {
        const process = this.process;
        return process.processSteps.filter(x => x.complete === false)[0];
    }


    getStepNumber(url: string): number{
        const process = this.process;
        return process.processSteps.findIndex(x => x.route === url);
    }

    addStep(step: ProcessStep, index: number) {
        console.log('add step');
        const process = this.process;
        process.processSteps.splice(index, 0, step);
        this.dataService.setMspProcess(process);
    }


    getStep(stepNumber: number) {
        return this.process.processSteps[stepNumber];
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>
        | Promise<boolean>
        | boolean {
        console.log('can activate? state: ' + state.url);

        if (environment.bypassGuards) {
            return true;
        }
        console.log('can activate');
        
        // Find target route
        let lastIndex = 0;
        console.log(this.process);
        console.log(this.process.processSteps);
        for (lastIndex; lastIndex < this.process.processSteps.length; lastIndex++) {
            const step = this.process.processSteps[lastIndex];
            if (step.route === state.url) {
                // found last index
                lastIndex--;
                break;
            }
        }

        // Ensure all previous steps were complete
        for (let i = 0; i <= lastIndex; i++) {
            const step = this.process.processSteps[i];
            console.log('step: ' + step.route + '; ' + step.complete);

            if (step.complete == false) {
                // On the first step that is incomplete, navigate back one
                console.log('navigating back');
                this._router.navigate([this.process.processSteps[i].route]);

                //If validation fails because of an activeElement not being validated, we scroll to it and trigger validation.
                const bodyRect = document.body.getBoundingClientRect();
                const elemRect = document.activeElement.getBoundingClientRect();
                const offset = elemRect.top - bodyRect.top;
                document.body.scrollTop = offset - (document.activeElement !== document.body ? 50 : 0);

                //Force validation to trigger by causing blur
                //We wrap this in a try/catch, because it's theoretically possible the last activeElement is not an HTML element, but an SVG.
                try {
                    (<HTMLElement>document.activeElement).blur(); //works?
                }catch (e) {
                    console.error(e);
                }

                return false;
            }
        }
        console.log('router guard OK');
        return true;
    }
}
