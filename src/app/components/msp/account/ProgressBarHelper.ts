import {MspAccount, AccountChangeOptions} from '../model/account.model';

export class ProgressBarHelper {

    public static readonly br = "<br>";
    lang = require('./i18n');
    private _height: Object = {'height': '60px'};
    private _dependentsLabel: string = "";
    private _personalInfoLabel: string = "";
    private _widthMainMenu: Object = {};
    private _widthPersonalInfo: Object = {};
    private _widthDependents: Object = {};
    private _widthDocumentUpload: Object = {};

    constructor(private _accountChangeOptions: AccountChangeOptions) {
        this.constructLabels();
        this.constructHeight();
        this.constructWidths();
    }

    private constructWidths(): void {
        let isAllFourTabsShown = this._accountChangeOptions.hasAllOptionsSelected() || (this._accountChangeOptions.hasAnyPISelected() && this._accountChangeOptions.depdendentChange) ;
        if (isAllFourTabsShown  ) {     // All Four tabs  shown
            this._widthMainMenu = {'width': '15%'};
            this._widthDocumentUpload = {'width': '15%'};
            this._widthPersonalInfo = {'width': '30%'};
            this._widthDependents = {'width': '20%'};
            return;
        }
        if (this._accountChangeOptions.hasAnyPISelected()){
            this._widthMainMenu = {'width': '22.5%'};
            this._widthDocumentUpload = {'width': '25%'};
            this._widthPersonalInfo = {'width': '30%'};
            return ;
        }
        if (this._accountChangeOptions.depdendentChange){
            this._widthMainMenu = {'width': '20%'};
            this._widthDocumentUpload = {'width': '25%'};
            this._widthDependents = {'width': '35%'};
            return ;
        }


    }

    private constructHeight(): void {
        this._height = {'height': '60px'};
        if (this._accountChangeOptions.hasAllPISelected() ) {
            this._height = {'height': '90px'};
            return;
        }
        if (this._accountChangeOptions.depdendentChange && this._accountChangeOptions.hasAnyPISelected()) {
            this._height = {'height': '80px'};
            return;
        }
        if (this._accountChangeOptions.depdendentChange && this._accountChangeOptions.addressUpdate) {
            this._height = {'height': '70px'};
            return;
        }

    }

    private constructLabels(): void {
        let newline: string = "";
        if (this._accountChangeOptions.hasAnyPISelected()) {
            if (this._accountChangeOptions.personInfoUpdate) {
                this._personalInfoLabel = this.lang('./en/index.js').progressStepPersonalInfo;
                newline = ProgressBarHelper.br;
            }
            if (this._accountChangeOptions.addressUpdate) {
                this._personalInfoLabel = this._personalInfoLabel.concat(newline).concat(this.lang('./en/index.js').progressStepAddressUpdate);
                newline = ProgressBarHelper.br;
            }
            if (this._accountChangeOptions.statusUpdate) {
                this._personalInfoLabel = this._personalInfoLabel.concat(newline).concat(this.lang('./en/index.js').progressStepUpdateStatus);
            }
        }

        if (this._accountChangeOptions.depdendentChange) {
            this._dependentsLabel = this.lang('./en/index.js').progressStepDependents;
            if (this._accountChangeOptions.addressUpdate && !this._accountChangeOptions.hasAnyPISelected()) {
                this._dependentsLabel = this._dependentsLabel.concat(ProgressBarHelper.br).concat(this.lang('./en/index.js').progressStepAddressUpdate);
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
}