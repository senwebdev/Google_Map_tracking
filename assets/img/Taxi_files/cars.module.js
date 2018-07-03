/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.settings.cars', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('settings.cars', {
          url: '/cars',
          templateUrl: 'app/pages/settings/cars/cars.html',
          title: 'Car Types',
          controller: 'carsCtrl'
          // sidebarMeta: {
          //   icon: 'ion-document-text',
          //   order: 10
          // }
        })
  }

})();
