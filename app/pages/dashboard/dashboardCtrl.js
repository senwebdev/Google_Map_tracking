(function () {
    'use strict';
    angular.module('BlurAdmin.pages.dashboard')
    .controller('dashboardCtrl', dashboardCtrl)
    function dashboardCtrl($timeout,$mdSidenav,$log,$rootScope, $scope,$window, baConfig,$http, MY_CONSTANT,ngDialog,$state,$filter, socketFactory, toastr)
    {
        $scope.visb=false;
        $scope.datas = {
            group1 : 'user_id',
            group2 : 'driver_id',
            group3 : 'id'
          };
          $scope.clear1=function(){$scope.inp2='';}
          $scope.clear2=function(){$scope.inp1='';}
       
        $scope.getPassengerList = function () {
            $scope.isLoading = true;
            if($scope.datas.group1=='user_id');
            {
                // $scope.inp1=parseInt($scope.inp1);
            }
            let data = { 
                access_token: localStorage.getItem("access_token"), 
                searchFlag: 2, 
                searchString: $scope.inp1, 
                searchKey: $scope.datas.group1 
            };
            console.log("datadatadata", data);
            
            $http({
                method: "POST",
                url: MY_CONSTANT.url +'/admin/user_list',
                header:{
                    'Content-Type':'application/json;'
                },
                data: data
            }).success(function (data, status) {

                if(data.users.length==0)
                {
                    $rootScope.openToast('error', 'Record not found', '');
                    console.log("true");
                }
                else{
                    $scope.visb=true;
                    console.log(data);
                    $scope.data=data.users[0];
                    $scope.id=$scope.data.user_id;
                    $scope.name=$scope.data.user_name;
                    $scope.email=$scope.data.user_email;
                    $scope.mobile=$scope.data.user_mobile;
                    $scope.image=$scope.data.user_image;
                    $scope.code= $scope.data.referral_code;
                    $scope.regd=moment($scope.data.date_registered).format('MMMM Do YYYY, h:mm:ss a');
                    $scope.loginl=moment($scope.data.last_login).format('MMMM Do YYYY, h:mm:ss a');
                    console.log($scope.data); 
                }
                    
            }).error(function (data, status) {
                
            });

        };  
        $scope.get_driver = function() {

            $scope.isLoading = true;
            console.log("inputt", $scope.inp2);
            console.log("group2", $scope.datas.group2);
            console.log("xxxxxxxxx", {
              access_token: localStorage.getItem("access_token"),
              searchFlag: 2,
              searchString: $scope.inp2,
              searchKey: $scope.datas.group2,
              requestType: 3
            });

            if($scope.datas.group2==='driver_id');
            {
               // $scope.inp2=parseInt($scope.inp2);
                console.log("driver_idxxxxxxxxxx", $scope.inp2);
            }

            let data = { 
                access_token: localStorage.getItem("access_token"), 
                searchFlag: 2, 
                searchString: $scope.inp2, 
                searchKey: $scope.datas.group2, 
                requestType: 3 };

            $http({
              method: "POST",
              url: MY_CONSTANT.url + "/admin/drivers_by_type",
              header: {
                "Content-Type": "application/json;"
              },
              data: data
            })
              .success(function(data, status) {
                if (data.drivers.length == 0) {
                  $rootScope.openToast("error", "Record not found", "");
                  console.log("true");
                } else {
                  $scope.visb = true;
                  console.log(data);
                  $scope.data=data.drivers[0];
                  $scope.id=$scope.data.driver_id;
                  $scope.name=$scope.data.driver_name;
                  $scope.email=$scope.data.driver_email;
                  $scope.mobile=$scope.data.driver_mobile;
                  $scope.image=$scope.data.driver_image;
                  $scope.code= $scope.data.referral_code;
                  $scope.regd=moment($scope.data.date_registered).format('MMMM Do YYYY, h:mm:ss a');
                  $scope.loginl=moment($scope.data.last_login).format('MMMM Do YYYY, h:mm:ss a');
                  console.log($scope.data);
                }
              })
              .error(function(data, status) {
                console.log(data);
              });
        };
             
    }
})();