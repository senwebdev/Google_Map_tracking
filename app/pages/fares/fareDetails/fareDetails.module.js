/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.fares.fareDetails', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('fares.fareDetails', {
                url: '/fareDetails/:lat/:lng',
                templateUrl: 'app/pages/fares/fareDetails/fareDetails.html',
                title: 'fare Details',
                controller: 'fareDetailsCtrl'
            });
    }
})();
