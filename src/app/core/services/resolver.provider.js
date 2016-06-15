'use strict';

export default function (app) {
    app.provider('resolver', resolverProvider);

    function resolverProvider () {
        this.asyncPagePrealoading = asyncPagePrealoading;
        this.$get = function() { return this; };
    }

    
        function asyncPagePrealoading ($q) {
            "ngInject";

            var defer = $q.defer();
            // Some async stuff (request, calculations, etc.)
            return defer.promise;
        }
    

}
