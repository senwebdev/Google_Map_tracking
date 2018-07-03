/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.reportdetails.userreport', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('reportdetails.userreport', {
                url: '/userreport',
                templateUrl: 'app/pages/reportdetails/userreport/userreport.html',
                title: 'User Reports',
                controller: 'userreportCtrl'
            });
    }
})();