/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.reportdetails.pastridesreport', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('reportdetails.pastridesreport', {
                url: '/pastridesreport',
                templateUrl: 'app/pages/reportdetails/pastridesreport/pastridesreport.html',
                title: 'User Reports',
                controller: 'pastridesreportCtrl'
            });
    }
})();