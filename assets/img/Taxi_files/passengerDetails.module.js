/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.passengerDetails', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('passengerDetails', {
          url: '/passengerDetails',
          templateUrl: 'app/pages/passengers/passengerDetails.html',
          title: 'Passenger Details',
          controller: 'passengerDetailsCtrl'
        })
  }

})();
