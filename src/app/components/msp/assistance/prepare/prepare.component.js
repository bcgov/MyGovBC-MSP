"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var application_data_service_1 = require('../../application/application-data.service');
require('./prepare.component.less');
var AssistancePrepareComponent = (function () {
    function AssistancePrepareComponent(dataService) {
        this.dataService = dataService;
        this.lang = require('./i18n');
        this._showDisabilityInfo = false;
        this._showChildrenInfo = false;
    }
    Object.defineProperty(AssistancePrepareComponent.prototype, "showDisabilityInfo", {
        get: function () {
            return this._showDisabilityInfo;
        },
        set: function (doShow) {
            this._showDisabilityInfo = doShow;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssistancePrepareComponent.prototype, "showChildrenInfo", {
        get: function () {
            return this._showChildrenInfo;
        },
        set: function (show) {
            this._showChildrenInfo = show;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssistancePrepareComponent.prototype, "finAssistApp", {
        get: function () {
            return this.dataService.finAssistApp;
        },
        enumerable: true,
        configurable: true
    });
    AssistancePrepareComponent.prototype.addSpouse = function () {
        this.finAssistApp.hasSpouseOrCommonLaw = true;
    };
    AssistancePrepareComponent = __decorate([
        core_1.Component({
            templateUrl: './prepare.component.html'
        }), 
        __metadata('design:paramtypes', [application_data_service_1.default])
    ], AssistancePrepareComponent);
    return AssistancePrepareComponent;
}());
exports.AssistancePrepareComponent = AssistancePrepareComponent;
//# sourceMappingURL=prepare.component.js.map