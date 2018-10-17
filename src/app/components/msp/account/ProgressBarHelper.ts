import {AccountChangeOptions} from '../model/account.model';

export class ProgressBarHelper {


    /** Separator to be used when concatenating strings for labels */
    public static readonly seperator = '<br>';
    lang = require('./i18n');
    private _height: Object = {'height': '70px'};
    private _dependentsLabel: string = '';
    private _personalInfoLabel: string = '';
    private _widthMainMenu: Object = {};
    private _widthPersonalInfo: Object = {};
    private _widthDependents: Object = {};
    private _widthDocumentUpload: Object = {};
    private _widthReview: Object = {};

    constructor(private _accountChangeOptions: AccountChangeOptions) {
        this.constructLabels();
        this.constructWidths();
    }



    private constructWidths(): void {
        const isAllFourTabsShown = this._accountChangeOptions.hasAllOptionsSelected() || (this._accountChangeOptions.hasAnyPISelected() && this._accountChangeOptions.dependentChange) ;


        if (isAllFourTabsShown  ) {     // All Four tabs  shown
            this._widthMainMenu = {'width': '13%'};
            this._widthDocumentUpload = {'width': '20%'};
            this._widthPersonalInfo = {'width': '34%'};
            this._widthDependents = {'width': '21%'};
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

    /**
     * Fills out label properties on this class depending on account change
     * options.
     */
    private constructLabels(): void {
       this.constructPILabel();

        //_dependentsLabel
        if (this._accountChangeOptions.dependentChange) {
            this._dependentsLabel = this.lang('./en/index.js').progressStepDependents;
            if (this._accountChangeOptions.addressUpdate && !this._accountChangeOptions.hasAnyPISelected()) {
                this._dependentsLabel = this._dependentsLabel.concat(ProgressBarHelper.seperator).concat(this.lang('./en/index.js').progressStepAddressUpdate);
            }
        }

    }

    /**
     * Sets _personalInfoLabel based on account change options.
     */
    private constructPILabel(): void {
        let seperatorString: string = '';
        if (this._accountChangeOptions.hasAnyPISelected()) {
            if (this._accountChangeOptions.personInfoUpdate) {
                this._personalInfoLabel = this.lang('./en/index.js').progressStepPersonalInfo;
                seperatorString = ProgressBarHelper.seperator;
            }
            if (this._accountChangeOptions.addressUpdate) {
                this._personalInfoLabel = this._personalInfoLabel.concat(seperatorString).concat(this.lang('./en/index.js').progressStepAddressUpdate);
                seperatorString = ProgressBarHelper.seperator;
            }
            if (this._accountChangeOptions.statusUpdate) {
                this._personalInfoLabel = this._personalInfoLabel.concat(seperatorString).concat(this.lang('./en/index.js').progressStepUpdateStatus);
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
