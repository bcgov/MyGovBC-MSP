import {AccountChangeOptions} from '../model/account.model';

export class ProgressBarHelper {

    // public static readonly seperator = "<br>";
    public static readonly seperator = ", ";
    lang = require('./i18n');
    private _height: Object = {'height': '70px'};
    private _dependentsLabel: string = "";
    private _personalInfoLabel: string = "";
    private _widthMainMenu: Object = {};
    private _widthPersonalInfo: Object = {};
    private _widthDependents: Object = {};
    private _widthDocumentUpload: Object = {};

    private _widthReview: Object = {};

    constructor(private _accountChangeOptions: AccountChangeOptions) {
        this.constructLabels();
        this.constructHeight();
        this.constructWidths();
    }



    private constructWidths(): void {
        let isAllFourTabsShown = this._accountChangeOptions.hasAllOptionsSelected() || (this._accountChangeOptions.hasAnyPISelected() && this._accountChangeOptions.dependentChange) ;

        console.log(`'fourTabs? ${isAllFourTabsShown}`, this._accountChangeOptions);

        if (isAllFourTabsShown  ) {     // All Four tabs  shown
            this._widthMainMenu = {'width': '14%'};
            this._widthDocumentUpload = {'width': '18%'};
            this._widthPersonalInfo = {'width': '33%'};
            this._widthDependents = {'width': '20%'};
            this._widthReview  = {'width': '17%'};
            return;
        }
        if (this._accountChangeOptions.hasAnyPISelected()){
            this._widthMainMenu = {'width': '15%'};
            this._widthDocumentUpload = {'width': '25%'};
            this._widthPersonalInfo = {'width': '35%'};
            this._widthReview  = {'width': '20%'};
            return ;
        }
        if (this._accountChangeOptions.dependentChange){
            this._widthMainMenu = {'width': '20%'};
            this._widthDocumentUpload = {'width': '25%'};
            this._widthDependents = {'width': '35%'};
            this._widthReview  = {'width': '20%'};
            return ;
        }


    }

    private constructHeight(): void {
        this._height = {'height': '60px'};
        if (this._accountChangeOptions.hasAllPISelected() ) {
            this._height = {'height': '90px'};
            return;
        }
        if (this._accountChangeOptions.dependentChange && this._accountChangeOptions.hasAnyPISelected()) {
            this._height = {'height': '75px'};
            return;
        }
        if (this._accountChangeOptions.dependentChange && this._accountChangeOptions.addressUpdate) {
            this._height = {'height': '70px'};
            return;
        }

    }

    private constructLabels(): void {
        let newline: string = "";
        if (this._accountChangeOptions.hasAnyPISelected()) {
            if (this._accountChangeOptions.personInfoUpdate) {
                this._personalInfoLabel = this.lang('./en/index.js').progressStepPersonalInfo;
                newline = ProgressBarHelper.seperator;
            }
            if (this._accountChangeOptions.addressUpdate) {
                this._personalInfoLabel = this._personalInfoLabel.concat(newline).concat(this.lang('./en/index.js').progressStepAddressUpdate);
                newline = ProgressBarHelper.seperator;
            }
            if (this._accountChangeOptions.statusUpdate) {
                this._personalInfoLabel = this._personalInfoLabel.concat(newline).concat(this.lang('./en/index.js').progressStepUpdateStatus);
            }
        }

        if (this._accountChangeOptions.dependentChange) {
            this._dependentsLabel = this.lang('./en/index.js').progressStepDependents;
            if (this._accountChangeOptions.addressUpdate && !this._accountChangeOptions.hasAnyPISelected()) {
                this._dependentsLabel = this._dependentsLabel.concat(ProgressBarHelper.seperator).concat(this.lang('./en/index.js').progressStepAddressUpdate);
            }
        }

    }


    get personalInfoLabel(): string {
        return this._personalInfoLabel;
    }



    get height(): Object {
        return this._height;
    }

    get widthMainMenu(): Object {
        return this._widthMainMenu;
    }

    get widthPersonalInfo(): Object {
        return this._widthPersonalInfo;
    }

    get widthDependents(): Object {
        return this._widthDependents;
    }

    get widthDocumentUpload(): Object {
        return this._widthDocumentUpload;
    }


    get dependentsLabel(): string {
        return this._dependentsLabel;
    }

    get widthWidthReview(): Object {
        return this._widthReview;
    }


}