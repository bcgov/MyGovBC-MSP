import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import { MspDataService } from "./msp-data.service";

export class ProcessUrls {
    public static readonly ACCOUNT_PREPARE_URL = "/msp/account/prepare" ;
    public static readonly ACCOUNT_FILE_UPLOADER_URL = "/msp/account/documents" ;
    public static readonly ACCOUNT_REVIEW_URL = "/msp/account/review" ;
    public static readonly ACCOUNT_PERSONAL_INFO_URL = "/msp/account/personal-info" ;
    public static readonly ACCOUNT_DEPENDENTS_URL = "/msp/account/dependent-change" ;
    public static readonly ACCOUNT_SENDING_URL = "/msp/account/sending" ;


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
export class ProcessService implements CanActivate {

    constructor(private dataService: MspDataService,
                private _router: Router) {
    }

    get process(): Process {
        return this.dataService.getMspProcess();
    }

    init(processSteps: ProcessStep[]): void {
        let process = new Process();
        process.processSteps = processSteps;
        this.dataService.setMspProcess(process);
    }

    setStep(stepNumber: number, complete: boolean) {
        let process = this.process;
        process.processSteps[stepNumber].complete = complete;
        this.dataService.setMspProcess(process);
    }

    getNextStep(stepNumber:number):String {
        let process = this.process;
        return process.processSteps[stepNumber+1].route;
    }

   /* getNextStep(): String {
        return this.getFirstFalseStep().route;
    }*/
    //used to find the next step to navigate to when steps are defined at runtime
    getFirstFalseStep(): ProcessStep {
        let process = this.process;
        return process.processSteps.filter(x => x.complete === false)[0];
    }


    getStepNumber(url:string):number{
        let process = this.process;
        return process.processSteps.findIndex(x => x.route === url);
    }

    addStep(step: ProcessStep, index: number) {
        let process = this.process;
        process.processSteps.splice(index, 0, step);
        this.dataService.setMspProcess(process);
    }


    getStep(stepNumber: number) {
        return this.process.processSteps[stepNumber]
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>
        | Promise<boolean>
        | boolean {
        console.log("can activate? state: " + state.url);

        // Find target route
        let lastIndex = 0;
        for (lastIndex; lastIndex < this.process.processSteps.length; lastIndex++) {
            let step = this.process.processSteps[lastIndex];
            if (step.route === state.url) {
                // found last index
                lastIndex--;
                break;
            }
        }

        // Ensure all previous steps were complete
        for (let i = 0; i <= lastIndex; i++) {
            let step = this.process.processSteps[i];
            console.log("step: " + step.route + "; " + step.complete);

            if (step.complete == false) {
                // On the first step that is incomplete, navigate back one
                console.log("navigating back");
                this._router.navigate([this.process.processSteps[i].route]);

                //If validation fails because of an activeElement not being validated, we scroll to it and trigger validation.
                let bodyRect = document.body.getBoundingClientRect();
                let elemRect = document.activeElement.getBoundingClientRect();
                let offset = elemRect.top - bodyRect.top;
                document.body.scrollTop = offset - (document.activeElement !== document.body ? 50 : 0);

                //Force validation to trigger by causing blur
                //We wrap this in a try/catch, because it's theoretically possible the last activeElement is not an HTML element, but an SVG.
                try {
                    (<HTMLElement>document.activeElement).blur(); //works?
                }
                catch (e) {
                    console.error(e);
                }

                return false;
            }
        }
        console.log("router guard OK");
        return true;
    }
}