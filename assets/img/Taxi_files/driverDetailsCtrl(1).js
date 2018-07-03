/* Copyrights-Developed by Taxi Technologies INC. */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.drivers.approvedDriverDetails')
        .controller('approvedDriverDetailsCtrl', approvedDriverDetailsCtrl);

    function approvedDriverDetailsCtrl($timeout, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter, $rootScope) {

        
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







        $rootScope.showloader = true;
        if (localStorage.getItem('driverID')) {
            $scope.driverID = localStorage.getItem('driverID');
        } else $state.go('drivers.approved');
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $scope.maxSize = 5;
        $scope.skip = 0;
        $scope.pageChanged = function(currentPage) {
            $scope.currentPage = currentPage;
            console.log('Page changed to: ' + $scope.currentPage);
            for (var i = 1; i <= $scope.totalItems / 10 + 1; i++) {
                if ($scope.currentPage == i) {
                    $scope.skip = 10 * (i - 1);
                    console.log('Offset changed to: ' + $scope.skip);
                    //$scope.$apply();
                }
            }
            $scope.initTable();
        };
        $scope.initTable = function() {
            $scope.driver = {};
            $scope.driverRideList = [];
            $.post(MY_CONSTANT.url + '/get_all_docs', {
                    driver_id: $scope.driverID,
                    access_token: localStorage.getItem('access_token'),
                    is_verified: 2,
                    limit: 10,
                    offset: $scope.skip
                })
                .success(function(data, status) {
                    console.log(data);
                    $scope.docLength = data.docs.length;
                })
            $.post(MY_CONSTANT.url + '/driver_details', {
                    driver_id: $scope.driverID,
                    access_token: localStorage.getItem('access_token')
                })
                .success(function(data, status) {
                    var arr = [];
                    var d = data;
                    console.log(d);


            $scope.drivers = {
                "count": data.total_rides,
                "data":data.all_rides
            }


                    $scope.totalRides = d.total_rides;
                    $scope.totalItems = d.total_rides;
                    $scope.driver = d.driver_detail[0];
                    $("input").prop('disabled', true);
                    if ($scope.driver.total_rating_driver && $scope.driver.total_rating_got)
                        $scope.driver.average_rating = parseFloat($scope.driver.total_rating_driver / $scope.driver.total_rating_got).toFixed(2);
                    else $scope.driver.average_rating = '0'
                    if ($scope.driver.date_registered == '0000-00-00 00:00:00' || $scope.driver.date_registered == null) $scope.driver.date_registered_formatted = 'N/A';
                    else $scope.driver.date_registered_formatted = moment($scope.driver.date_registered).format('MMM DD YYYY, hh:mm A');
                    if ($scope.driver.last_login == '0000-00-00 00:00:00' || $scope.driver.last_login == null) $scope.driver.last_login_formatted = 'N/A';
                    else $scope.driver.last_login_formatted = moment($scope.driver.last_login).format('MMM DD YYYY, hh:mm A');
                    if ($scope.driver.last_logout == '0000-00-00 00:00:00' || $scope.driver.last_logout == null) $scope.driver.last_logout_formatted = 'N/A';
                    else $scope.driver.last_logout_formatted = moment($scope.driver.last_logout).format('MMM DD YYYY, hh:mm A');
                    $scope.driverRideList = d.paginated_rides;
                    for (var i = 0; i < $scope.driverRideList.length; i++) {
                        if ($scope.driverRideList[i].car_type == 0)
                            $scope.driverRideList[i].car_type = 'QS'
                        else if ($scope.driverRideList[i].car_type == 1)
                            $scope.driverRideList[i].car_type = 'QLE'
                        else if ($scope.driverRideList[i].car_type == 2)
                            $scope.driverRideList[i].car_type = 'LUXE'
                        else if ($scope.driverRideList[i].car_type == 3)
                            $scope.driverRideList[i].car_type = 'GRANDE'
                        switch ($scope.driverRideList[i].ride_status) {
                            case 0:
                                $scope.driverRideList[i].ride_status_name = "Assigning"
                                break;
                            case 1:
                                $scope.driverRideList[i].ride_status_name = "Accepted"
                                break;
                            case 2:
                                $scope.driverRideList[i].ride_status_name = "Arrived"
                                break;
                            case 3:
                                $scope.driverRideList[i].ride_status_name = "Started"
                                break;
                            case 4:
                                $scope.driverRideList[i].ride_status_name = "Completed"
                                break;
                            case 5:
                                $scope.driverRideList[i].ride_status_name = "Cancelled By Driver"
                                break;
                            case 6:
                                $scope.driverRideList[i].ride_status_name = "Ride Cancelled By User"
                                break;
                            case 7:
                                $scope.driverRideList[i].ride_status_name = "Request Cancelled By User"
                                break;

                        }
                    }

                    $rootScope.showloader = false;
                    var dtInstance;
                    $scope.$apply(function() {
                        $timeout(function() {
                            if (!$.fn.dataTable) return;
                            dtInstance = $('#datatabledriverRides').dataTable({
                                'searching': false,
                                'paging': true, // Table pagination
                                'ordering': true, // Column ordering
                                'info': true, // Bottom left status text
                                "scrollX": "2500px",
                                "scrollY": "600px",
                                'bDestroy': true,
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
                        $scope.$on('$destroy', function() {
                            dtInstance.fnDestroy();
                            $('[class*=ColVis]').remove();
                        });
                    });
                    // $scope.$apply();s
                })
        }
        $scope.initTable();
        $scope.viewDocs = function() {
            $state.go('drivers.documents');
            localStorage.setItem('driverID', $scope.driverID);
            localStorage.setItem('driverName', $scope.driver.driver_name);
        }
        $scope.back = function() {
            $state.go('drivers.approved');
        }
    }
})();
