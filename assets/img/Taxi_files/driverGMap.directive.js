(function () {
  'use strict';

  angular.module('BlurAdmin.pages.track.driverTracking')
      .directive('driverGMap', driverGMap);

  /** @ngInject */
  function driverGMap() {
    return {
      restrict: 'E',
      controller: 'driverGMapCtrl',
      templateUrl: 'app/pages/track/driverTracking/driverGMap/driverGMap.html'
    };
  }
})();
