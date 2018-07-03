/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.customerTracking')
      .directive('customerGMap', customerGMap);

  /** @ngInject */
  function customerGMap() {
    return {
      restrict: 'E',
      controller: 'customerGMapCtrl',
      templateUrl: 'app/pages/customerTracking/customerGMap/customerGMap.html'
    };
  }
})();