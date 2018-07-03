/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.passengerDetails')
        .controller('passengerDetailsCtrl', passengerDetailsCtrl);
    function passengerDetailsCtrl($timeout,$rootScope, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter) {
        $rootScope.showloader=true;
        $scope.back = function() {
            $state.go('passengers')
        }
        if(localStorage.getItem('userID'))$scope.userID=localStorage.getItem('userID');
        else $state.go('passengers');
        $('input').attr('disabled','disabled');
        $scope.user={};
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $scope.maxSize=5;
        $scope.skip = 0;
        $scope.pageChanged = function (currentPage) {
            $scope.currentPage = currentPage;
            console.log('Page changed to: ' + $scope.currentPage);
            for(var i=1;i<=$scope.totalItems/10+1;i++) {
                if ($scope.currentPage == i) {
                    $scope.skip = 10*(i-1);
                    console.log('Offset changed to: ' + $scope.skip);
                    //$scope.$apply();
                }
            }
            $scope.initTable();
        };


        'use strict';

        $scope.selected = [];
        $scope.limitOptions = [5, 10, 15];

        $scope.options = {
            rowSelection: false,
            multiSelect: false,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: true,
            boundaryLinks: true,
            limitSelect: true,
            pageSelect: true
        };

        $scope.query = {
            filter: '',
            order: 'driver_id',
            limit: 5,
            page: 1
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










        $scope.initTable = function() {
            $scope.userRideList=[];
            $.post(MY_CONSTANT.url + '/user_details', {
                    user_id: $scope.userID,
                    access_token: localStorage.getItem('access_token'),
                    limit:10,
                    offset:$scope.skip
                })
                .success(function (data, status) {
                    var arr = [];
                    var d = data;
                    console.log(d);



                    $scope.drivers = {
                        "count": data.total_rides,
                        "data":data.all_rides
                    }




                    $scope.totalRides = d.total_rides;
                    $scope.totalItems = d.total_rides;
                    $scope.user = d.user_detail[0];
                    $("input").prop('disabled', true);
                    if($scope.user.total_rating_user && $scope.user.total_rating_got)
                    $scope.user.average_rating = parseFloat($scope.user.total_rating_user / $scope.user.total_rating_got).toFixed(2);
                    else $scope.user.average_rating = '0'
                    if($scope.user.date_registered=='0000-00-00 00:00:00'||$scope.user.date_registered==null) $scope.user.date_registered_formatted='N/A';
                    else $scope.user.date_registered_formatted = moment($scope.user.date_registered).format('MMM DD YYYY, hh:mm A');
                    if($scope.user.last_login=='0000-00-00 00:00:00'||$scope.user.last_login==null) $scope.user.last_login_formatted='N/A';
                    else $scope.user.last_login_formatted = moment($scope.user.last_login).format('MMM DD YYYY, hh:mm A');
                    if($scope.user.last_logout=='0000-00-00 00:00:00'||$scope.user.last_logout==null) $scope.user.last_logout_formatted='N/A';
                    else $scope.user.last_logout_formatted = moment($scope.user.last_logout).format('MMM DD YYYY, hh:mm A');
                    $scope.userRideList = d.paginated_rides;
                    for (var i = 0; i < $scope.userRideList.length; i++) {
                        if ($scope.userRideList[i].car_type == 0)
                            $scope.userRideList[i].car_type = 'QS'
                        else if ($scope.userRideList[i].car_type == 1)
                            $scope.userRideList[i].car_type = 'QLE'
                        else if ($scope.userRideList[i].car_type == 2)
                            $scope.userRideList[i].car_type = 'LUXE'
                        else if ($scope.userRideList[i].car_type == 3)
                            $scope.userRideList[i].car_type = 'GRANDE'
                            switch ($scope.userRideList[i].ride_status) {
                                case 0:
                                    $scope.userRideList[i].ride_status_name = "Assigning"
                                    break;
                                case 1:
                                    $scope.userRideList[i].ride_status_name = "Accepted"
                                    break;
                                case 2:
                                    $scope.userRideList[i].ride_status_name = "Arrived"
                                    break;
                                case 3:
                                    $scope.userRideList[i].ride_status_name = "Started"
                                    break;
                                case 4:
                                    $scope.userRideList[i].ride_status_name = "Completed"
                                    break;
                                case 5:
                                    $scope.userRideList[i].ride_status_name = "Cancelled By Driver"
                                    break;
                                case 6:
                                    $scope.userRideList[i].ride_status_name = "Ride Cancelled By User"
                                    break;
                                case 7:
                                    $scope.userRideList[i].ride_status_name = "Request Cancelled By User"
                                    break;

                            }
                    }
                    var dtInstance;
                    $rootScope.showloader=false;
                    $scope.$apply(function (){
                    $timeout(function () {
                        if (!$.fn.dataTable) return;
                        dtInstance = $('#datatableUserRides').dataTable({
                            'searching': false,
                            'paging': true,  // Table pagination
                            'ordering': true,  // Column ordering
                            'info': true,  // Bottom left status text
                            "scrollX": "2500px",
                            "scrollY": "600px",
                            'bDestroy':true,
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
                    }, 100);
                    $scope.$on('$destroy', function () {
                        dtInstance.fnDestroy();
                        $('[class*=ColVis]').remove();
                    });
                  });
                    // $scope.$apply();
                })
                .error(function (data, status) {

                });
        }
        $scope.initTable();
    }
})();
