(function () {
  'use strict';
  angular.module('BlurAdmin.pages.heat')
  .controller('heatCtrl', heatCtrl)
  function heatCtrl($timeout,$mdSidenav,$log,$rootScope, $scope,$window, baConfig,$http, MY_CONSTANT,ngDialog,$state,$filter, socketFactory, toastr)
  {
     var map = new google.maps.Map(document.getElementById('heat_map'), {
        zoom: 5,
        center: {lat: 40.712775, lng: -74.005973},
      });
      $scope.max_pick=function()
      {
          if($scope.heatmap)
          {
              $scope.heatmap.setMap(null);
          }
          $scope.heatmap = new google.maps.visualization.HeatmapLayer({
              data: getPoints1(),
              map: map
            });
      }
      $scope.app_open=function()
      {
          if($scope.heatmap)
          {
              $scope.heatmap.setMap(null);
          }
          $scope.heatmap = new google.maps.visualization.HeatmapLayer({
              data: getPoints2(),
              map: map
            });
         
      }
      $scope.failed_request=function()
      {
          if($scope.heatmap)
          {
              $scope.heatmap.setMap(null);
          }
          $scope.heatmap = new google.maps.visualization.HeatmapLayer({
              data: getPoints3(),
              map: map
            });
      }
      $scope.drop_off=function()
      {
          if($scope.heatmap)
          {
              $scope.heatmap.setMap(null);
          }
          $scope.heatmap = new google.maps.visualization.HeatmapLayer({
              data: getPoints4(),
              map: map
            });
      }
    function getPoints1() {
      return [
        new google.maps.LatLng(55.45809644,-2.6375011),
        new google.maps.LatLng(55.53725133,-2.32116728),
        new google.maps.LatLng(55.36839316,-4.49234048),
       new google.maps.LatLng(54.8690565,-2.95481366),
       new google.maps.LatLng(55.68525994,-4.37992014),
       new google.maps.LatLng(55.97816557,-3.32820861),
       new google.maps.LatLng(55.58395503,-4.20988446),
       new google.maps.LatLng(54.79222465,-3.7246803),
       new google.maps.LatLng(55.9215601,-4.28051626),
      ];
    }
    function getPoints2() {
      return [
        new google.maps.LatLng(52.406822, -1.519692999999961),
        new google.maps.LatLng(55.91689182,-3.73525081),
        new google.maps.LatLng(55.41469884,-3.23661758),
       new google.maps.LatLng(55.36801555,-2.72644778),
       new google.maps.LatLng( 55.43498891,-3.06154377),
       new google.maps.LatLng(55.36460371,-2.95360804),
       new google.maps.LatLng(55.02375213,-2.56732175),
       new google.maps.LatLng(55.50452729,-3.22015908),
       new google.maps.LatLng(54.73183296,-3.38926001),
      ];
    }
    function getPoints3() {
      return [
        new google.maps.LatLng(55.58768218,-3.25503636),
        new google.maps.LatLng(55.58768218,-3.25503636),
        new google.maps.LatLng(55.13316235,-4.20396576),
       new google.maps.LatLng(55.49800815,-3.35758007),
       new google.maps.LatLng( 55.55929014,-4.58657422),
       new google.maps.LatLng(55.84880008,-3.29217046),
       new google.maps.LatLng(56.06911332,-3.36861741),
       new google.maps.LatLng(55.25169122,-3.80390043),
       new google.maps.LatLng(55.24130558,-2.59662346),
      ];
    }
    function getPoints4() {
      return [
        new google.maps.LatLng(52.406822, -1.519692999999961),
        new google.maps.LatLng(55.91689182,-3.73525081),
        new google.maps.LatLng(55.41469884,-3.23661758),
       new google.maps.LatLng(55.36801555,-2.72644778),
       new google.maps.LatLng( 55.43498891,-3.06154377),
       new google.maps.LatLng(55.36460371,-2.95360804),
       new google.maps.LatLng(55.02375213,-2.56732175),
       new google.maps.LatLng(55.50452729,-3.22015908),
       new google.maps.LatLng(54.73183296,-3.38926001),
      ];
    }
      };
})();
