/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.setting', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('setting', {
                url: '/setting',
                templateUrl: 'app/pages/setting/setting.html',
                controller: 'settingCtrl',
                abstract: false,
                title: 'Setting'
            
            });
    }

})();
