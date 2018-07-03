/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.drivers.approvedDriverDetails', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('drivers.approvedDriverDetails', {
          url: '/approvedDriverDetails',
          templateUrl: 'app/pages/drivers/approved/driverDetails.html',
          title: 'Driver Details',
          controller: 'approvedDriverDetailsCtrl'
        })
  }

})();
