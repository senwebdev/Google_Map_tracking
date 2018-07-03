/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.fleetManagement', [
          'BlurAdmin.pages.fleetManagement.addVehicle'
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('fleetManagement', {
          url: '/fleetManagement',
          templateUrl: 'app/pages/fleetManagement/fleetManagementTable.html',
          title: 'Fleet',
          controller: 'fleetManagementCtrl',
          sidebarMeta: {
            icon: 'ion-social-buffer',
            order: 4
          }
        })
  }

})();
