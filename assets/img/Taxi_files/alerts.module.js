/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.alert', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('alert', {
          url: '/alert',
          templateUrl: 'app/pages/alerts/alertTable.html',
          title: 'Alerts',
          controller: 'alertsCtrl'
          // sidebarMeta: {
          //   icon: 'ion-alert',
          //   order: 5
          // }
        })
  }

})();
