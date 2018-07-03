/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings', [
            'BlurAdmin.pages.settings.documents',
            'BlurAdmin.pages.settings.cars'
        ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
      $stateProvider.state("settings", {
        url: "/settings",
        template: "<div ui-view></div>",
        abstract: true,
        title: "Settings",
        sidebarMeta: {
          icon: "ion-gear-a",
          order: 100
        }
      });
    }

})();
