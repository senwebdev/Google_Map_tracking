/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.fares.fareDetails')
        .controller('fareDetailsCtrl', fareDetailsCtrl);
    function fareDetailsCtrl($timeout, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter) {

        var regionArray = [];
        var cityDetails = [];
        $scope.showloader=true;
        $scope.show = 0;
        var lat = $location.search().lat;
        var lng = $location.search().long;

        $.post(MY_CONSTANT.url + '/get_fare_by_region', {
                latitude: lat,
                longitude: lng
            },
            function (data) {
                if (typeof(data) == "string") {
                    data = JSON.parse(data);
                }
                var dataArray = [];
                if (data.status == 200) {
                    var carList = data.fare_details;
                    //$scope.region_id = data.fare_details[0].region_id;
                    carList.forEach(function (column) {
                        var d = {};
                        d.car_type = column.car_type;
                        d.car_name = column.car_name;
                        d.car_id = column.car_id;
                        d.fare_fixed = column.fare_fixed;
                        d.fare_per_km = column.fare_per_km;
                        d.fare_per_min = column.fare_per_min;
                        d.fare_threshold_distance = column.fare_threshold_distance;
                        d.fare_threshold_time = column.fare_threshold_time;
                        d.wait_time_fare_per_min = column.wait_time_fare_per_min;
                        d.luggage_factor = column.luggage_factor;
                        d.car_seats = column.car_seats;
                        d.pre_wait_time_fare = column.pre_wait_time_fare;
                        d.pre_wait_time_threshold = column.pre_wait_time_threshold;
                        dataArray.push(d);
                        //on success applying list all regions api for pre select
                        $scope.$apply(function () {
                            $scope.list = dataArray;
                            $scope.regionlist = regionArray;
                        });
                    });
                }
            });

    //getting all regions in select box
    $.post(MY_CONSTANT.url + '/list_all_regions', {
            //access_token: $cookieStore.get('obj').accesstoken
        },
        function (data) {
            if (typeof(data) == "string") {
                data = JSON.parse(data);
            }
            regionArray = [];
            regionArray.push({
                region_id: 0,
                region_name: "Default"
            })
            var htmlContent = '';
            htmlContent += '<option value="' + 0 + '">' + 'Default' + '</option>';
            cityDetails[0] = 0;
            if (data.status == 200) {
                var areaList = data.data.region_list;
                areaList.forEach(function (column) {
                    var d = {};
                    d.region_id = column.region_id;
                    d.region_name = column.region_name;
                    regionArray.push(d);
                });
                areaList.forEach(function (column) {
                    htmlContent += '<option value="' + column.region_id + '">' + column.region_name + '</option>';
                    cityDetails[column.region_id] = column;
                });
                $('#city').append(htmlContent);
                $scope.set(0);
                $scope.showloader=false;
            }
        });
  /*--------------------------------------------------------------------------
   *----------------- function when region_id change ---------------------------
   --------------------------------------------------------------------------*/
  $('#city').change(function () {
      $scope.set($('#city').val());
  });
  
  $scope.set = function (region_id) {
      $scope.show = 1;
      $.post(MY_CONSTANT.url + '/get_fare_by_region', {
              region_id:region_id
          },
          function (data) {
              var dataArray = [];
              if(typeof(data)=="string")
                  data = JSON.parse(data);
              if (data.status == 200) {
                  var carList = data.fare_details;
                  // $scope.region_id = data.fare_details[0].region_id
                  carList.forEach(function (column) {
                      var d = {};
                      d.car_type = column.car_type;
                      d.car_name = column.car_name;
                      d.car_id = column.car_id;
                      d.fare_fixed = column.fare_fixed;
                      d.fare_per_km = column.fare_per_km;
                      d.fare_per_min = column.fare_per_min;
                      d.fare_threshold_distance = column.fare_threshold_distance;
                      d.fare_threshold_time = column.fare_threshold_time;
                      d.wait_time_fare_per_min = column.wait_time_fare_per_min;
                      d.luggage_factor = column.luggage_factor;
                      d.car_seats = column.car_seats;
                      d.pre_wait_time_fare = column.pre_wait_time_fare;
                      d.pre_wait_time_threshold = column.pre_wait_time_threshold;
                      dataArray.push(d);
                      //on success applying list all regions api for pre select
                      $scope.$apply(function () {
                          $scope.list = dataArray;
                      });
                  });
              }
          });

        }
    }
})();
