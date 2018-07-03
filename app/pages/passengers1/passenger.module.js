/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.passenger', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('passengers', {
          url: '/passengers',
          templateUrl: 'app/pages/passengers/passengerTable.html',
          title: 'Passengers',
          controller: 'passengerCtrl'
          // sidebarMeta: {
          //   icon: 'ion-person-stalker',
          //   order: 2
          // }
        })
  }

})();
