/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.editUser', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('editUser', {
                url: '/editUser',
                templateUrl: 'app/pages/passengers/editUser.html',
                title: 'Edit Users',
                controller: 'editUserCtrl'
            });
    }
})();
