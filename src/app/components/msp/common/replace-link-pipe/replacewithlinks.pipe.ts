import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'replacewithlinks'
})
export class ReplacewithlinksPipe implements PipeTransform {

    lang = require('./i18n');
    private links = this.lang('./en/index.js').links;

    transform(value: any, args?: any): any {
        let str: String = value;
        if (value) {
            this.links.forEach(linkData => {
                var re = new RegExp(linkData.code,"gi");
                str = str.replace(re, linkData.name);
            })
        }
        return str;
    }

}
