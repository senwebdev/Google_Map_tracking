/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.drivers.completed')
        .controller('completedDriverCtrl', completedDriverCtrl);

        function completedDriverCtrl($timeout, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter,$rootScope) {

        'use strict';
        var bookmark;
        
        $scope.selected = [];
        $scope.limitOptions = [15, 25, 35];

        $scope.options = {
            rowSelection: false,
            multiSelect: false,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: true,
            boundaryLinks: true,
            limitSelect: true,
            pageSelect: false
        };

        $scope.query = {
            filter: '',
            order: 'drop_time',
            limit: 10,
            page: 1,
            requestType: 2,
            searchFlag: 1
        };

        $scope.filter = {
            options: {
                debounce: 500
            }
        };

        $scope.removeFilter = function () {
            $scope.filter.show = false;
            $scope.query.filter = '';
            console.log("removed filter");
        };

        $scope.$watch('query.filter', function (newValue, oldValue) {
            
            if(!oldValue) {
                bookmark = $scope.query.page;
            }

            if(newValue !== oldValue) {
                $scope.query.page = 1;
            }

            if(!newValue) {
                $scope.query.page = bookmark;
            }

            $scope.get_rides_by_type();
        });

        $scope.get_rides_by_type = function(){
            $scope.isLoading = true;
            $scope.skip= ($scope.query.page-1)*$scope.query.limit;
            

            $http({
                method: "POST",
                url: MY_CONSTANT.url +'/admin/get_rides_by_type',
                header:{
                    'Content-Type':'application/json;'
                },
                data:{
                    access_token: localStorage.getItem('access_token'),
                    limit:$scope.query.limit,
                    offset:$scope.skip,
                    requestType:2,
                    searchFlag: $scope.query.filter? 1 : 0,
                    searchString: $scope.query.filter,
                    requestType: $scope.query.requestType,
                    // sort_by: 'drop_time',
                    sort_order: 'DESC',
                    test: 333
                 }
            })

            // $.post(MY_CONSTANT.url + '/admin/get_rides_by_type', {
            //     access_token: localStorage.getItem('access_token'),
            //     limit:$scope.query.limit,
            //     offset:$scope.skip,
            //     requestType:2,
            //     searchFlag: $scope.query.filter? 1 : 0,
            //     searchString: $scope.query.filter,
            //     requestType: $scope.query.requestType,
            //     sort_by: 'drop_time',
            //     sort_order: 'DESC',
            //     test: 333
            // })
            .success(function (data, status) {
                $scope.isLoading = false;
                $timeout(function() {   
                   $scope.completedRideZ = data.rides;
               }, 100);
                    $scope.completedRide = data.total_rides;
                console.log('completed lists', data);
                //  $scope.completedRideZ = data.rides;  
                    // if (data.flag == 1201) {
                    //     console.log("success in getting completed rides data", data);
                    //     if(typeof(data)=='string')
                    //         // data = JSON.parse(data);
                    //         // $scope.completedRide = data.total_rides;
                    //         // var x = data;
                    //         // console.log("x is declared", x);
                    //         // $scope.completedRideZ = [];
                    //         // $scope.completedRideZ = data.rides; 
                    //         // $scope.$apply(); 
                    // }
                })
            }
            $scope.get_rides_by_type();
        };
         
})();