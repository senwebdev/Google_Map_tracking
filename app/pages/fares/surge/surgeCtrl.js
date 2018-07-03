/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.fares.surge')
        .controller('surgeFaresCtrl', surgeFaresCtrl);
    function surgeFaresCtrl($timeout, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter) {
    $scope.show_table=false;
        $scope.showvalue=1;
        $scope.editvalue=0;
        $scope.showupdate=0;
        //getting region list
        $scope.getRegions = function() {
            $.post(MY_CONSTANT.url + '/get_all_regions', {
                access_token: localStorage.getItem('access_token')

            }, function (data) {
                var regionArray = [];
                regionArray.push({
                    region_id:0,
                    region_name:"Default"
                });
                var dataArray = [];
                var excelArray = [];
                if (typeof(data) == "string")
                    data = JSON.parse(data);

                if (data.status == 401) {
                    $state.go('page.login');
                }
                else if (data.status == 200) {
                    console.log(data);
                    var areaList = data.regions;
                    areaList.forEach(function (column) {
                        var d ={};
                        d.region_id = column.region_id;
                        d.region_name = column.region_name;
                        regionArray.push(d);

                    });
                    console.log(regionArray);
                    $scope.$apply(function () {
                        $scope.regionlist = regionArray;
                        $scope.region_id = 0
                    });
                    $scope.getFare();
                }
            });
        };
        $scope.getRegions();
        $scope.getFare = function(){
            $http.post(MY_CONSTANT.url + '/list_all_cars', {access_token: localStorage.getItem('access_token')})
                .success(function (data) {
                    var dataArray = [];
                    //data = JSON.parse(data);
                    if (data.status== 200) {
                        var carList = data.data.car_list;
                        $scope.select_car = data.data.car_list[0].car_type;
                        // $scope.car_type =data.data.car_id;

                        carList.forEach(function (column) {
                            var d = {};
                            d.car_type = column.car_type;
                            d.car_name = column.car_name;
                            //d.car_id = column.car_id;
                            //d.fare_fixed = column.fare_fixed;
                            //d.fare_per_km = column.fare_per_km;
                            //d.fare_per_min = column.fare_per_min;
                            //d.wait_time_fare_per_min=column.wait_time_fare_per_min;
                            dataArray.push(d);
                        });
                        //$scope.$apply(function () {
                            $scope.list = dataArray;
                        console.log($scope.list);
                            $scope.car_type = data.data.car_list[0].car_type;
                            $scope.set();  //calling set() function to show all data at first of frst type
                        //});
                    }
                    else{
                        $state.go('page.login');
                    }
                });
        };


        /*--------------------------------------------------------------------------
         *----------------- funtion when car type change ---------------------------
         --------------------------------------------------------------------------*/
        $scope.set = function () {

            //if(angular.isUndefined($scope.region_id)){
            //    $scope.errorMsg = "Select Region";
            //    setTimeout(function () {
            //        $scope.errorMsg = "";
            //        $scope.$apply();
            //    }, 3000);
            //    return false;
            //}
            //if(angular.isUndefined($scope.car_type)){
            //    $scope.errorMsg = "Select Car Type";
            //    setTimeout(function () {
            //        $scope.errorMsg = "";
            //        $scope.$apply();
            //    }, 3000);
            //    return false;
            //}
            console.log("set mai aaya ");
            $http.post(MY_CONSTANT.url + '/request_fare_details', {access_token: localStorage.getItem('access_token'),
                    car_type:$scope.car_type.toString(),
                    region_id:$scope.region_id.toString()
                }).success(function (data) {
                    var dataArray = [];
                    //data = JSON.parse(data);

                    if (data.status == 200) {
                        $scope.show_table=true;

                        var cartypelist = data.data;
                        cartypelist.forEach(function (column) {
                            var d = {};

                            d.id = column.id;
                            d.start_slot = column.start_slot;
                            d.end_slot = column.end_slot;
                            d.fare_fixed = column.fare_fixed;
                            //d.fare_per_min=column.fare_fixed;
                            //d.fare_per_km = column.fare_fixed;
                            //d.wait_time_fare_per_min = column.fare_fixed;

                            d.fare_per_min=column.fare_per_min;
                            d.fare_per_km = column.fare_per_km;
                            d.wait_time_fare_per_min = column.wait_time_fare_per_min;




                            dataArray.push(d);
                        });
                        $scope.cartypes = dataArray;
                        /*$scope.$apply(function () {
                            $scope.cartypes = dataArray;

                            // Define global instance we'll use to destroy later
                            var dtInstance;

                            $timeout(function () {
                                if (!$.fn.dataTable)
                                    return;
                                dtInstance = $('#datatable2').dataTable({
                                    'paging': true, // Table pagination
                                    'ordering': true, // Column ordering
                                    'info': true,// Bottom left status text
                                    'retrieve': true,
                                    // Text translation options
                                    // Note the required keywords between underscores (e.g _MENU_)
                                    oLanguage: {
                                        sSearch: 'Search all columns:',
                                        sLengthMenu: '_MENU_ records per page',
                                        info: 'Showing page _PAGE_ of _PAGES_',
                                        zeroRecords: 'Nothing found - sorry',
                                        infoEmpty: 'No records available',
                                        infoFiltered: '(filtered from _MAX_ total records)'
                                    }
                                });
                                var inputSearchClass = 'datatable_input_col_search';
                                var columnInputs = $('tfoot .' + inputSearchClass);

                                // On input keyup trigger filtering
                                columnInputs
                                    .keyup(function () {
                                        dtInstance.fnFilter(this.value, columnInputs.index(this));
                                    });
                            });
                            // When scope is destroyed we unload all DT instances
                            // Also ColVis requires special attention since it attaches
                            // elements to body and will not be removed after unload DT
                            $scope.$on('$destroy', function () {
                                dtInstance.fnDestroy();
                                $('[class*=ColVis]').remove();
                            });
                        });*/
                    }



                    else{
                        $scope.errorMsg=data.message;
                        setTimeout(function () {
                            $scope.errorMsg = "";
                            //$scope.$apply();
                        }, 3000);
                    }

                });
        };

        $scope.car = {};

        $scope.EditableInput=function(){
            $scope.showvalue=0;
            $scope.editvalue=1;
            $scope.showupdate=1;

        };
        $scope.SubmitUpdatedFare=function(data){
            for(var i=0;i<data.length;i++){
                data[i].fare_per_km=data[i].fare_fixed;
                data[i].fare_per_min=data[i].fare_fixed;
                data[i].wait_time_fare_per_min=data[i].fare_fixed;
            }

            var updatedFare =  JSON.stringify(data);


            $http.post(MY_CONSTANT.url + '/update_fare_details',  {
                    fare_update :updatedFare,
                    access_token:localStorage.getItem('access_token') ,
                    region_id:$scope.region_id

                }
            ).then(
                function (data) {
                    //data = JSON.parse(data);

                    if (data.status == 200) {
                        $scope.displaymsg = "Fares Updated Successfully. "
                        $scope.showupdate = 0;

                    }
                    else {
                        $scope.displaymsg = data.message;
                    }
                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        closeByDocument: false,
                        closeByEscape: false,
                        showClose:false
                    })

                });

        }

        /*--------------------------------------------------------------------------
         * ---------------- funtion for update car fare ----------------------------
         --------------------------------------------------------------------------*/
        $scope.addCarFare = function (cars) {
            $scope.successMsg = '';
            $scope.errorMsg = '';
            $scope.car.access_token = localStorage.getItem('access_token');
            $scope.car.car_id = $scope.select_car;
            $scope.car.fare_fixed = cars.fare_fixed;
            $scope.car.fare_per_km = cars.fare_per_km;
            $scope.car.fare_per_min = cars.fare_per_min;
            $scope.car.region_id = $scope.region_id;

            $http.post(MY_CONSTANT.url + '/update_car_fare', $scope.car
            ).then(
                function (data) {
                    data = JSON.parse(data);

                    if (data.status == 200) {
                        $scope.successMsg = data.message.toString();
                        $scope.promo = {};
                        //$scope.$apply();
                        setTimeout(function () {
                            $scope.successMsg = "";
                            //$scope.$apply();
                        }, 3000);
                    } else {
                        $scope.errorMsg = data.message.toString();
                        //$scope.$apply();
                        setTimeout(function () {
                            $scope.errorMsg = "";
                            //$scope.$apply();
                        }, 3000);
                    }
                    scrollTo(0, 0);
                });
        };

        $scope.ok = function(){
            ngDialog.close({
                template: 'display_msg_modalDialog',
                className: 'ngdialog-theme-default',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false,
                showClose:false
            });
            $state.reload();
        }
    }
})();
