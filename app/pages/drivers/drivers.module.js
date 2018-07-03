/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.drivers', [
            'BlurAdmin.pages.drivers.approved',
            'BlurAdmin.pages.drivers.complete',
            'BlurAdmin.pages.drivers.approve',
            'BlurAdmin.pages.drivers.editDriver',
            'BlurAdmin.pages.drivers.pending',
            'BlurAdmin.pages.drivers.appointments',
            'BlurAdmin.pages.drivers.driverDetails',
            'BlurAdmin.pages.drivers.documents',
            'BlurAdmin.pages.drivers.documentsAll',
            'BlurAdmin.pages.drivers.approvedDriverDetails',
            'BlurAdmin.pages.drivers.editAppDriver',
            
        ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('drivers', {
                url: '/drivers',
                template : '<div ui-view></div>',
                abstract: true,
                title: 'Drivers'
                // sidebarMeta: {
                //     icon: 'ion-ios-person',
                //     order: 3
                // }
            });
    }

})();
