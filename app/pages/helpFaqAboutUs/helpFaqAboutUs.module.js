/**
 * @author v.lugovsky
 * created on 21.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.helpFaqAboutUs', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('helpFaqAboutUs', {
          url: '/helpFaqAboutUs',
          templateUrl: 'app/pages/helpFaqAboutUs/helpFaqAboutUs.html',
          title: 'Help & FAQ',
          controller: 'helpFaqAboutUsCtrl',
          sidebarMeta: {
              icon: 'ion-information',
              order: 10
          }
        });
  }

})();
