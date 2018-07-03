/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.geoFencing.viewAreaDetails', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('geoFencing.viewAreaDetails', {
          url: '/viewAreaDetails',
          templateUrl: 'app/pages/geoFencing/viewAreaDetails/viewAreaDetails.html',
          title: 'Region Details',
          controller: 'viewAreaDetailsCtrl'
        })
  }

})();
