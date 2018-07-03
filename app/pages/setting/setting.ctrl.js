/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.setting')
        .controller('settingCtrl', settingCtrl);
    function settingCtrl($mdEditDialog, $q, $timeout,$mdDialog,$mdSidenav, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter,promoService)
     {
       
      
        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('right');
    
        function buildToggler(componentId) {
          return function() {
            $mdSidenav(componentId).toggle();
          };
        }
      
    
    }
  
})();

 