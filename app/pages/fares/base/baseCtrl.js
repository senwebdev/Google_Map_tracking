/* Copyrights-Developed by Qudos USA LLC */
(function() {
  "use strict";

  angular
    .module("BlurAdmin.pages.fares.base")
    .controller("baseFaresCtrl", baseFaresCtrl);
  function baseFaresCtrl(
    $timeout,
    $scope,
    $http,
    MY_CONSTANT,
    ngDialog,
    $state,
    $filter
  ) {
    $scope.getRegions = function() {
      console.log("12300");
      $.post(
        MY_CONSTANT.url + "/get_all_regions",
        {
          access_token: localStorage.getItem("access_token")
        },
        function(data) {
          var regionArray = [];
          regionArray.push({
            region_id: 0,
            region_name: "Default"
          });
          var dataArray = [];
          var excelArray = [];
          if (typeof data == "string") {
            data = JSON.parse(data);
          }

          if (data.status == 401) {
            $state.go("page.login");
          } else if (data.status == 200) {
            console.log(data);
            var areaList = data.regions;
            areaList.forEach(function(column) {
              var d = {};
              d.region_id = column.region_id;
              d.region_name = column.region_name;
              regionArray.push(d);
            });
            //on success applying list aal cars api for pre select

            //$scope.$apply(function () {
            $scope.regionlist = regionArray;
            console.log($scope.regionlist);

            $scope.region_id = 0;

            $http
              .post(MY_CONSTANT.url + "/list_all_cars", {
                access_token: localStorage.getItem("access_token")
              })
              .success(function(data) {
                ////data = JSON.parse(data);
                if (data.status == 200) {
                  //$scope.$apply(function () {
                  $scope.select_car = data.data.car_list[0].car_type;
                  $scope.set(0);
                  scrollTo(0, 0);
                  //});
                }
              });
            //});
          }
        }
      );
    };
    $scope.getRegions();

    //======getting list of cars =====//
    $http
      .post(MY_CONSTANT.url + "/list_all_cars", {
        access_token: localStorage.getItem("access_token")
      })
      .success(function(data) {
        var dataArray = [];
        //data = JSON.parse(data);
        if (data.status == 200) {
          var carList = data.data.car_list;
          carList.forEach(function(column) {
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
            d.car_seats = column.car_seats;
            d.cancellation_time = column.cancellation_time;
            d.cancellation_fee = column.cancellation_fee;
            dataArray.push(d);
          });
          $scope.list = dataArray;
          //$scope.$apply(function () {
          //    $scope.list = dataArray;
          //});
        }
      });

    /*--------------------------------------------------------------------------
         *----------------- funtion when car type change ---------------------------
         --------------------------------------------------------------------------*/
    $scope.set = function(flag, a) {
      console.log($scope.region_id);
      console.log($scope.select_car);
      console.log(a);
      if (a != undefined) $scope.select_car = a;
      /*if(angular.isUndefined($scope.region_id)){
                $scope.errorMsg = "Select Region";
                setTimeout(function () {
                    $scope.errorMsg = "";
                    //$scope.$apply();
                }, 3000);
                return false;
            }
            if(angular.isUndefined($scope.select_car)){
                $scope.errorMsg = "Select Car Type";
                setTimeout(function () {
                    $scope.errorMsg = "";
                    //$scope.$apply();
                }, 3000);
                return false;
            }*/

      $http
        .post(MY_CONSTANT.url + "/list_all_cars", {
          access_token: localStorage.getItem("access_token"),
          region_id: $scope.region_id
        })
        .success(function(data) {
          //data = JSON.parse(data);

          if (data.status == 200) {
            var length = data.data.car_list.length;
            for (var i = 0; i < length; i++) {
              console.log($scope.select_car);
              if ($scope.select_car == data.data.car_list[i].car_type) {
                //$scope.$apply(function () {

                console.log(data.data.car_list[i].car_type);
                $scope.cars = {
                  fare_per_min: data.data.car_list[i].fare_per_min,
                  fare_per_km: data.data.car_list[i].fare_per_km,
                  fare_fixed: data.data.car_list[i].fare_fixed,
                  fare_threshold_distance:
                    data.data.car_list[i].fare_threshold_distance,
                  fare_threshold_time:
                    data.data.car_list[i].fare_threshold_time,
                  wait_time_fare_per_min:
                    data.data.car_list[i].wait_time_fare_per_min,
                  car_seats: data.data.car_list[i].car_seats,
                  cancellation_time: data.data.car_list[i].cancellation_time,
                  cancellation_fee: data.data.car_list[i].cancellation_fee
                };
                //});
              }
            }
          }
        });
    };

    $scope.car = {};

    /*--------------------------------------------------------------------------
         * ---------------- funtion for update car fare ----------------------------
         --------------------------------------------------------------------------*/
    $scope.addCarFare = function(cars) {
      console.log(cars.fare_per_min);
      $scope.successMsg = "";
      $scope.errorMsg = "";
      $scope.car.access_token = localStorage.getItem("access_token");
      $scope.car.car_id = $scope.select_car.toString();
      $scope.car.fare_fixed = cars.fare_fixed.toString();
      $scope.car.fare_per_km = cars.fare_per_km.toString();
      $scope.car.fare_per_min = cars.fare_per_min.toString();
      $scope.car.wait_time_fare_per_min = cars.wait_time_fare_per_min.toString();
      $scope.car.fare_threshold_time = cars.fare_threshold_time.toString();
      $scope.car.fare_threshold_distance = cars.fare_threshold_distance.toString();
      $scope.car.car_seats = cars.car_seats.toString();
      $scope.car.cancellation_time = cars.cancellation_time.toString();
      $scope.car.cancellation_fee = cars.cancellation_fee.toString();
      $scope.car.region_id = $scope.region_id.toString();

      //if($scope.car.car_id == '' || $scope.car.car_id == undefined) {
      //    $scope.errorMsg = "Please select car type";
      //    setTimeout(function () {
      //        $scope.errorMsg  = "";
      //        $scope.$apply();
      //    }, 3000);
      //}
      //else{
      $http
        .post(MY_CONSTANT.url + "/admin/update_car_fare", $scope.car)
        .then(function(data) {
          //data = JSON.parse(data);

          if (data.status == 200) {
            $scope.successMsg = data.data.message;

            // alert("Car fare updated successfully");
            //$scope.$apply();
            setTimeout(function() {
              console.log("a");
              $scope.successMsg = "";
              $scope.$apply();
            }, 3000);
          } else {
            $scope.errorMsg = data.data.message;
            //$scope.$apply();
            setTimeout(function() {
              $scope.errorMsg = "";
              $scope.$apply();
            }, 3000);
          }
          scrollTo(0, 0);
        });
      // }
    };
  }
})();