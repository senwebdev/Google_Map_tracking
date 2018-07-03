/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.passenger')
        .controller('passengerCtrl', passengerCtrl);
    function passengerCtrl($timeout,$rootScope, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter) {
        $scope.pageSize = 10;
        $scope.delete_passenger_id = '';
        $scope.displaymsg = '';
        $scope.driverpass ={};
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $scope.maxSize=5;
        $rootScope.showloader=true;
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
            dtInstance.fnDestroy();
            $scope.initTable();
        };
        $scope.exportData = function () {
            alasql('SELECT * INTO CSV("passengers.csv",{headers:true}) FROM ?',[$scope.list]);
        };
        var dtInstance;



        /*--------------------------------------------------------------------------
         * -------------------------funtion to MD-Data Table --------------------------
         --------------------------------------------------------------------------*/




        'use strict';

        $scope.selected = [];
        $scope.limitOptions = [5, 10, 15];

        $scope.options = {
            rowSelection: false,
            multiSelect: true,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: true,
            boundaryLinks: true,
            limitSelect: true,
            pageSelect: true
        };

        $scope.query = {
            filter: '',
            order: 'user_id',
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

/*            if($scope.filter.form.$dirty) {
                $scope.filter.form.$setPristine();
            }*/
        };

/*
        $http({
            method: 'POST',
            url: MY_CONSTANT.url + '/get_promocode',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: 'access_token='+localStorage.getItem('access_token')
        }).success(function (data) {
            console.log("$scope.desserts "+data.promo_codes);
            $scope.desserts = {
                "count": data.promo_codes.length,
                "data":data.promo_codes
            }

            //console.log("$scope.desserts "+$scope.desserts);
        });
*/




        $scope.initTable = function() {

            $.post(MY_CONSTANT.url + '/user_list', {
                    access_token: localStorage.getItem('access_token'),
                    limit:10,
                    offset:$scope.skip
                })
                .success(function (data, status) {
                    var arr = [];
                    var d = data;
                    console.log(d);
                    $scope.usersTotal = d.total_users;
                    $scope.totalItems = d.total_users;

                    $scope.desserts = {
                        "count": data.total_users,
                        "data":data.users
                    }

                    console.log("value of desserts  "+$scope.desserts);


                    $scope.list = d.paginated_users;
                    for (var i = 0; i < $scope.list.length; i++) {
                        if($scope.list[i].total_rating_user && $scope.list[i].total_rating_got)
                        $scope.list[i].average_rating = parseFloat(($scope.list[i].total_rating_user / $scope.list[i].total_rating_got).toFixed(2));
                        else $scope.list[i].average_rating=0;
                        // console.log($scope.list[i])
                    }
                    $scope.$apply(function () {

                    $rootScope.showloader=false;
                    $timeout(function () {
                        console.log("Asd");
                        if (!$.fn.dataTable) return;
                        dtInstance = $('#datatablePassangers').dataTable({
                            'paging': true,  // Table pagination
                            'ordering': true,  // Column ordering
                            'info': true,
                            'scrollY': '500px',
                            'scrollX': '2000px',
                            "destroy": true,
                            // Bottom left status text

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
                    });

                    // When scope is destroyed we unload all DT instances
                    // Also ColVis requires special attention since it attaches
                    // elements to body and will not be removed after unload DT
                    $scope.$on('$destroy', function () {
                        dtInstance.fnDestroy();
                        $('[class*=ColVis]').remove();
                    });
                    });
                })
                .error(function (data, status) {

                });
        }
        $scope.initTable();

        $scope.deletepassenger_popup = function (delete_passenger_id) {

            $scope.delete_passenger_id = delete_passenger_id;

            ngDialog.open({
                template: 'delete_passenger_modalDialog',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        };


















        /*--------------------------------------------------------------------------
         * -------------------------funtion to delete passenger --------------------------
         --------------------------------------------------------------------------*/
        $scope.delete_passenger = function (delete_passenger_id) {
            console.log(delete_passenger_id);
            ngDialog.close({
                template: 'delete_passenger_modalDialog',
                className: 'ngdialog-theme-default',
                scope: $scope
            });

            $http.post(MY_CONSTANT.url + '/delete_user',{
                access_token: localStorage.getItem('access_token'),
                user_id: delete_passenger_id.toString()
            }).success(function (data,status) {
                console.log(data);
                $scope.displaymsg = '';

                if (data.status == 200) {
                    $scope.displaymsg = "Passenger is deleted successfully.";
                }

                else {
                    $scope.displaymsg = data.message.toString();
                }
                //$scope.$apply();
                ngDialog.open({
                    template: 'display_msg_modalDialog',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
            });
        };


        /*--------------------------------------------------------------------------
         * --------- funtion to open dialog for block or unblock passenger ------------
         --------------------------------------------------------------------------*/
        $scope.blockunblockpassenger_popup = function (is_blocked,user_id) {

            $scope.blockunblockmsg = '';
            $scope.blockunblockid = user_id;
            $scope.is_blocked = is_blocked;

            if (is_blocked == 1) {
                $scope.blockunblockmsg = "Are you sure you want to block this passenger?";
            } else {
                $scope.blockunblockmsg = "Are you sure you want to unblock this passenger?";
            }

            ngDialog.open({
                template: 'block_unblock_passenger_modalDialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });

        };

        /*--------------------------------------------------------------------------
         * ------------------ funtion to block or unblock passenger -------------------
         --------------------------------------------------------------------------*/
        $scope.do_block_unblock_passenger = function (is_blocked,blockunblockid) {

            $.post(MY_CONSTANT.url + '/block_unblock_user',
                {
                    access_token: localStorage.getItem('access_token'),
                    "user_id": blockunblockid.toString(),
                    "block_flag": is_blocked.toString()
                }).success(function (data,status) {


                    if (data.status == 200) {
                        if (is_blocked == 1) {
                            $scope.displaymsg = "Passenger is blocked successfully.";
                        } else {
                            $scope.displaymsg = "Passenger is unblocked successfully.";
                        }
                    }

                    else {
                        $scope.displaymsg = data.message.toString();
                    }
                    //$scope.$apply();
                    ngDialog.close({
                        template: 'block_unblock_passenger_modalDialog',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });

                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
                });
        };

        //==============================================================================================================================
//==========================================================password dialog-====================================================
//==============================================================================================================================
        $scope.openPasswordDialog = function(id){

            $scope.driver_pass_id = id
            ngDialog.open({
                template: 'password_dialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });

        }
        //==============================================================================================================================
//==========================================================password dialog-====================================================
//==============================================================================================================================
        $scope.driver={};
        $scope.changeDriverPass = function(driver){
            if(driver.password!=driver.confirmpassword){
                $scope.driverpass.errorMsg="Passwords don't match";
                $scope.driver.password='';
                $scope.driver.confirmpassword='';
                setTimeout(function () {
                    $scope.driverpass.errorMsg = "";},1500);
                return false;
            }
            $http.post(MY_CONSTANT.url + '/update_users_password',
                {
                    access_token: localStorage.getItem('access_token'),
                    user_id: $scope.driver_pass_id.toString(),
                    password:driver.password

                }).success(function (data,status) {
                    //data = JSON.parse(data);
                    if (data.status == 200) {
                        $scope.driver.password='';
                        $scope.driver.confirmpassword='';
                        $scope.driverpass.successMsg = data.message;
                        //$scope.$apply();
                        setTimeout(function () {
                            $scope.driverpass.successMsg = "";
                            //$scope.$apply();
                            ngDialog.close({
                                template: 'password_dialog',
                                className: 'ngdialog-theme-default',
                                showClose: false,
                                scope: $scope
                            });
                        }, 2000);
                    }
                    else {
                        $scope.driverpass.errorMsg = data.message;
                        //$scope.$apply();
                        setTimeout(function () {
                            $scope.driverpass.errorMsg = "";
                            //$scope.$apply();
                            ngDialog.close({
                                template: 'password_dialog',
                                className: 'ngdialog-theme-default',
                                showClose: false,
                                scope: $scope
                            });
                        }, 2000);
                    }
                });

        }

        /*--------------------------------------------------------------------------
         * --------- funtion to refresh page ---------------------------------------
         --------------------------------------------------------------------------*/
        $scope.refreshPage = function () {

            ngDialog.close({
                template: 'display_msg_modalDialog',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
            $state.reload();
        };
        /*--------------------------------------------------------------------------
         * --------- funtion to view user's rides ---------------------------------------
         --------------------------------------------------------------------------*/
          $scope.userDetails = function (id) {
            localStorage.setItem('userID',id);
            $state.go('passengerDetails');
          } ;

          $scope.editUser = function (d) {
            localStorage.setItem('userID',d.user_id);
            localStorage.setItem('userData',JSON.stringify(d));
            $state.go('editUser');
          } ;

    }
})();
