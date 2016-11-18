"use strict";
var FinancialAssistApplication = (function () {
    function FinancialAssistApplication() {
    }
    Object.defineProperty(FinancialAssistApplication.prototype, "hasSpouseOrCommonLaw", {
        get: function () {
            return this._hasSpouseOrCommonLaw;
        },
        set: function (arg) {
            if (!arg) {
                this.spouseEligibleForDisabilityCredit = arg;
                this.spouseNetIncome = null;
            }
            this._hasSpouseOrCommonLaw = arg;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FinancialAssistApplication.prototype, "selfDisabilityCredit", {
        get: function () {
            return this.eligibleForDisabilityCredit;
        },
        set: function (selfEligible) {
            this.eligibleForDisabilityCredit = selfEligible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FinancialAssistApplication.prototype, "spouseEligibleForDisabilityCredit", {
        get: function () {
            return this.spouseOrCommonLawEligibleForDisabilityCredit;
        },
        set: function (spouseEligible) {
            if (spouseEligible) {
                this._hasSpouseOrCommonLaw = true;
            }
            this.spouseOrCommonLawEligibleForDisabilityCredit = spouseEligible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FinancialAssistApplication.prototype, "hasChildrenInfo", {
        /**
         * Children info section
         */
        get: function () {
            return this._hasChildrenInfo;
        },
        enumerable: true,
        configurable: true
    });
    FinancialAssistApplication.prototype.addChildrenInfo = function () {
        this._hasChildrenInfo = true;
    };
    FinancialAssistApplication.prototype.removeChildrenInfo = function () {
        this._hasChildrenInfo = false;
    };
    return FinancialAssistApplication;
}());
exports.FinancialAssistApplication = FinancialAssistApplication;
//# sourceMappingURL=financial-assist-application.model.js.map