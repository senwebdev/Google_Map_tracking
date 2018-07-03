/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.track.driverTracking', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('track.driverTracking', {
          url: '/driverTracking',
          templateUrl: 'app/pages/track/driverTracking/driverTracking.html',
          title: 'Driver Tracking'
          // sidebarMeta: {
          //   icon: 'ion-ios-location',
          //   order: 2
          // }
        })
  }

})();
