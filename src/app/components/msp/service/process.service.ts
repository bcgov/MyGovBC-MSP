import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import MspDataService from "./msp-data.service";

export class Process {
  processSteps:ProcessStep[];
}

export class ProcessStep {
  route:string;
  complete: boolean = false;

  constructor(route:string) {
    this.route = route;
  }
}

@Injectable()
export default class ProcessService implements CanActivate {

  constructor(private dataService: MspDataService,
              private _router: Router) {
  }

  get process ():Process {
    return this.dataService.getMspProcess();
  }

  init(processSteps:ProcessStep[]):void {
    let process = new Process();
    process.processSteps = processSteps;
    this.dataService.setMspProcess(process);
  }

  setStep(stepNumber:number, complete:boolean) {
    let process = this.process;
    process.processSteps[stepNumber].complete = complete;
    this.dataService.setMspProcess(process);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean>
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
        return false;
      }
    }
    console.log("router guard OK");
    return true;
  }
}