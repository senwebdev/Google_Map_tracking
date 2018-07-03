/**
 * @author TA23
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
    'ui.router',
    'BlurAdmin.pages.dashboard',
    'BlurAdmin.pages.passenger',
    'BlurAdmin.pages.passengerDetails',
    'BlurAdmin.pages.editUser',
    'BlurAdmin.pages.drivers',
    'BlurAdmin.pages.settings',
    'BlurAdmin.pages.geoFencing',
    'BlurAdmin.pages.rides',
    'BlurAdmin.pages.track',
    'BlurAdmin.pages.subscribers',
    'BlurAdmin.pages.emailTemplate',
    'BlurAdmin.pages.addEditTemplate',
    'BlurAdmin.pages.alert',
    'BlurAdmin.pages.investor',
    'BlurAdmin.pages.promo',
    
    
     /* 'BlurAdmin.pages.geoFencing'*/
  ])
      .config(routeConfig);
      angular.module('BlurAdmin.pages')
          .directive('selectpicker', selectpicker);

      /** @ngInject */
      function selectpicker() {
        return {
          restrict: 'A',
          require: '?ngOptions',
          priority: 1500, // make priority bigger than ngOptions and ngRepeat
          link: {
            pre: function(scope, elem, attrs) {
              elem.append('<option data-hidden="true" disabled value="">' + (attrs.title || 'Select something') + '</option>')
            },
            post: function(scope, elem, attrs) {
              function refresh() {
                elem.selectpicker('refresh');
              }

              if (attrs.ngModel) {
                scope.$watch(attrs.ngModel, refresh);
              }

              if (attrs.ngDisabled) {
                scope.$watch(attrs.ngDisabled, refresh);
              }

              elem.selectpicker({ dropupAuto: true, hideDisabled: true });
            }
          }
        };
      }
  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/home');

    /*
    'BlurAdmin.pages.dashboardblur',
    'BlurAdmin.pages.admin',
    'BlurAdmin.pages.payment',
    'BlurAdmin.pages.helpFaqAboutUs',
    'BlurAdmin.pages.analytics',
    'BlurAdmin.pages.fleetManagement',
    'BlurAdmin.pages.reports',
    'BlurAdmin.pages.promo',
    'BlurAdmin.pages.vouchers',
    'BlurAdmin.pages.addBooking',
     'BlurAdmin.pages.corporateAccount',
    baSidebarServiceProvider.addStaticItem({
      title: 'Pages',
      icon: 'ion-document',
      subMenu: [{
        title: 'Sign In',
        fixedHref: 'auth.html',
        blank: true
      }, {
        title: 'Sign Up',
        fixedHref: 'reg.html',
        blank: true
      }, {
        title: 'User Profile',
        stateRef: 'profile'
      }, {
        title: '404 Page',
        fixedHref: '404.html',
        blank: true
      }]
    });
    baSidebarServiceProvider.addStaticItem({
      title: 'Menu Level 1',
      icon: 'ion-ios-more',
      subMenu: [{
        title: 'Menu Level 1.1',
        disabled: true
      }, {
        title: 'Menu Level 1.2',
        subMenu: [{
          title: 'Menu Level 1.2.1',
          disabled: true
        }]
      }]
    });*/
  }
/*
 'BlurAdmin.pages.ui',
 'BlurAdmin.pages.components',
 'BlurAdmin.pages.form',
 'BlurAdmin.pages.tables',
 'BlurAdmin.pages.charts',
 'BlurAdmin.pages.maps',
 'BlurAdmin.pages.profile',
* */
})();
