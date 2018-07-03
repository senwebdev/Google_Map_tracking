/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.fleetManagement')
        .controller('fleetManagementCtrl', fleetManagementCtrl);
    function fleetManagementCtrl($timeout, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter) {

            'use strict';
            $scope.addDriver = {};
            $scope.addDriver.email = '';
            $scope.delete_driver_id = '';
            $scope.uploaded_vehicle_img='';
            $scope.showloader=true;
            $scope.driverpass ={};
            $scope.assignDisable=false;
            //$scope.currency_sign = currency.currency_sign;


            $scope.exportData = function () {
                alasql('SELECT * INTO CSV("fleets.csv",{headers:true}) FROM ?', [ $scope.excelList]);
            };



            /*--------------------------------------------------------------------------
             * -------------------funtion to open dialog for add driver ----------------
             --------------------------------------------------------------------------*/
            $scope.AssignDriverPopup = function (id) {
                $scope.vehicle_id = id;

                $scope.showloader1=true;
                $http.post(MY_CONSTANT.url + '/get_unassigned_drivers', {
                    access_token: localStorage.getItem('access_token')

                }).success(function (data) {
                    $scope.showloader1 = false;
                    var dataArray1 = [];
                    if (data.status == 401) {
                        $state.go('page.login');
                    }
                    else if (data.status == 200) {
                        console.log(data);
                        $scope.showloader=false;
                        var driverList = data.data;
                        driverList.forEach(function (column) {
                            var d = {};
                            d.driver_id = column.driver_id;
                            d.user_name = column.user_name;
                            d.user_email = column.user_email;
                            d.user_image = column.user_image;
                            d.phone_no = column.phone_no;
                            dataArray1.push(d);
                        });
                        $scope.list1 = dataArray1;

                    }
                });
                $scope.userList='';
                ngDialog.open({
                    template: 'modalDialogId',
                    className: 'ngdialog-theme-default big-dialog',
                    showClose: false,
                    scope: $scope
                });
            };

            /*--------------------------------------------------------------------------
             * -------------------------funtion to add driver --------------------------
             --------------------------------------------------------------------------*/
            $scope.submit = function (addDriver) {
                $scope.data1=addDriver.email;
                console.log('lenght',$scope.data1.length);
                if($scope.data1[0]=='1' || $scope.data1[0]=='2' || $scope.data1[0]=='3'|| $scope.data1[0]=='0'|| $scope.data1[0]=='4' ||$scope.data1[0]=='5' || $scope.data1[0]=='6' || $scope.data1[0]=='7'|| $scope.data1[0]=='8' || $scope.data1[0]=='9')
                {
                    $scope.addDriver.errorMsg = 'Email Id is invalid';
                    $scope.$apply();
                    setTimeout(function () {
                        $scope.addDriver.errorMsg = "";
                        $scope.$apply();
                    }, 3000);
                    return;
                }

                $http.post(MY_CONSTANT.url + '/add_driver', {
                    access_token: localStorage.getItem('access_token'),
                    email: addDriver.email
                }).success(function (data) {
                    if (data.status == 200) {
                        $scope.addDriver.successMsg = "Mail sent to driver-id successfully.";
                       // $scope.$apply();
                        setTimeout(function () {
                            $scope.addDriver.successMsg = "";
                         //   $scope.$apply();
                            ngDialog.close({
                                template: 'modalDialogId',
                                className: 'ngdialog-theme-default',
                                showClose: false,
                                scope: $scope
                            });
                        }, 3000);
                    }
                    else if (data.status == 401){
                        $state.go('page.login');
                    }
                    else {
                        $scope.addDriver.errorMsg = data.message.toString();
                       // $scope.$apply();
                        setTimeout(function () {
                            $scope.addDriver.errorMsg = "";
                         //   $scope.$apply();
                            ngDialog.close({
                                template: 'modalDialogId',
                                className: 'ngdialog-theme-default',
                                showClose: false,
                                scope: $scope
                            });
                        }, 3000);
                    }
                })
            };

            $http.post(MY_CONSTANT.url + '/view_fleet_vehicle', {
                access_token: localStorage.getItem('access_token')
            }).success(function (data) {

                $scope.showloader=false;
                var array=[];
                var dataArray = [];
                var excelArray=[];
                console.log(data);

                if (data.status == 200) {
                    var driverList = data.data;
                    console.log("driver",driverList);
                    driverList.forEach(function (column) {
                        //==========================================================================================================================
//============================================================ data for excel =============================================
//==========================================================================================================================
                        var e={};
                        e.vehicle_name = column.vehicle_name;
                        e.vehicle_type=column.vehicle_type_name;
                        e.vehicle_identification_no = column.vehicle_identification_no;
                        e.vehicle_make = column.vehicle_make;
                        e.vehicle_model = column.vehicle_model;
                        e.vehicle_year = column.vehicle_year;
                        e.vehicle_license_plate = column.vehicle_license_plate;
                        e.max_passengers = column.max_passengers;
                        if(column.tlc_medallion_no=="undefined")
                            e.tlc_medallion_no = "NA";
                        else
                            e.tlc_medallion_no=column.tlc_medallion_no;
                        if(column.tlc_expiry_date=="0000-00-00 00:00:00")
                        {
                            e.tlc_expiry_date='NA'
                        }
                        else
                            e.tlc_expiry_date = moment(column.tlc_expiry_date).format('DD-MM-YYYY');

                        if(column.policy_expiry_date=="0000-00-00 00:00:00")
                        {
                            e.policy_expiry_date='NA'
                        }
                        else
                            e.policy_expiry_date = moment(column.policy_expiry_date).format('DD-MM-YYYY');
                        e.vehicle_front_photo = column.vehicle_front_photo;
                        if(column.drivers=='' || column.drivers==null)
                            e.Status="Assigned";
                        else
                            e.Status="Unassigned";
                        e.assigned_driver=(column.drivers=='' || column.drivers==null)?'--':column.drivers;

                        excelArray.push(e);


//==========================================================================================================================
//============================================================  end data for excel ========================================
//==========================================================================================================================
                        var d = {};
                        d.id=column.vehicle_id;
                        d.vehicle_name = column.vehicle_name;
                        d.vehicle_identification_no = column.vehicle_identification_no;
                        d.vehicle_make = column.vehicle_make;
                        d.vehicle_model = column.vehicle_model;
                        d.vehicle_year = column.vehicle_year;
                        d.vehicle_license_plate = column.vehicle_license_plate;
                        d.max_passengers = column.max_passengers;
                        if(column.tlc_medallion_no=="undefined")
                            d.tlc_medallion_no = "NA";
                        else
                            d.tlc_medallion_no=column.tlc_medallion_no;

                        if(column.tlc_expiry_date=="0000-00-00 00:00:00")
                        {
                            d.tlc_expiry_date='NA'
                        }
                        else
                            d.tlc_expiry_date = moment(column.tlc_expiry_date).format('DD-MM-YYYY');

                        if(column.policy_expiry_date=="0000-00-00 00:00:00")
                        {
                            d.policy_expiry_date='NA'
                        }
                        else
                            d.policy_expiry_date = moment(column.policy_expiry_date).format('DD-MM-YYYY');
                        d.vehicle_front_photo = (column.vehicle_front_photo=="DEFAULT_IMAGE")?'app/img/noimg.png':column.vehicle_front_photo;


                        d.assigned_driver=(column.drivers=='' || column.drivers==null)?'--':column.drivers.toString();
                        d.driver_id=(column.driver_id=='' || column.driver_id==null)?'--':column.driver_id.toString();

                        if(column.drivers=='' || column.drivers==null)
                            d.is_available=0;
                        else
                            d.is_available=1;

                        d.vehicle_type_name=column.vehicle_type_name;


                        dataArray.push(d);
                    });
                    $scope.list = dataArray;
                    $scope.excelList = excelArray;
                   /* $scope.$apply(function () {
                        $scope.list = dataArray;
                        $scope.excelList = excelArray;
                    */

                        // Define global instance we'll use to destroy later
                        var dtInstance;

                        $timeout(function () {
                            if (!$.fn.dataTable)
                                return;
                            dtInstance = $('#dataTableFleet').dataTable({
                                "bDestroy":true,
                                'paging': true, // Table pagination
                                'ordering': true, // Column ordering
                                'info': true, // Bottom left status text
                                // Text translation options
                                // Note the required keywords between underscores (e.g _MENU_)
                                oLanguage: {
                                    sSearch: 'Search all columns:',
                                    sLengthMenu: '_MENU_ records per page',
                                    info: 'Showing page _PAGE_ of _PAGES_',
                                    zeroRecords: 'Nothing found - sorry',
                                    infoEmpty: 'No records available',
                                    infoFiltered: '(filtered from _MAX_ total records)'
                                },
                                "aoColumnDefs": [
                                    { 'bSortable': false, 'aTargets': [ 9,11 ] }
                                ]
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

                }
                else if (data.status == 401){
                    $state.go('page.login');
                }
            });

            /*--------------------------------------------------------------------------
             * --------- funtion to refresh page ---------------------------------------
             --------------------------------------------------------------------------*/
            $scope.refreshPage = function () {
                $state.reload();
                ngDialog.close({
                    template: 'display_msg_modalDialog',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });

            };

            $scope.userList='';
            $scope.addUser=function(id)
            {
                $scope.userList=id;
            };

            $scope.assignDriver=function()
            {
                if($scope.userList=='')
                {
                    $scope.errorMsg = "Please select Driver.";
                    $timeout(function(){
                        $scope.errorMsg = "";
                    },3000);
                    return;
                }
                $http({
                    url : MY_CONSTANT.url + '/assign_fleet_vehicle',
                    method : 'POST',
                    data:
                    {
                        access_token: localStorage.getItem('access_token'),
                        vehicle_id:$scope.vehicle_id,
                        driver_id:$scope.userList
                    }
                }).success(function(data){
                    $scope.successMsg = data.message;
                    $timeout(function()
                    {
                        $scope.successMsg = "";
                        ngDialog.close();
                        $state.reload();

                    },3000)
                }).error(function(data){

                    if(data.status == 401){
                        $state.go('page.login');
                    }
                    else
                    {
                        $scope.errorMsg = data.message;
                        $timeout(function(){
                            $scope.errorMsg = "";
                        },3000)
                    }
                });
            };

            $scope.close=function()
            {
                ngDialog.close();
                $state.reload();
            };

            $scope.unassignPopup=function(id,driver_id)
            {
                $scope.vehicle_id=id;
                $scope.driver_id=driver_id;
                ngDialog.open({
                    template: 'delete_driver_modalDialog',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope
                });
            };

            $scope.delete_driver=function()
            {
                $http({
                    url : MY_CONSTANT.url + '/remove_fleet_vehicle_assignment',
                    method : 'POST',
                    data:
                    {
                        access_token: localStorage.getItem('access_token'),
                        vehicle_id:$scope.vehicle_id,
                        driver_id:$scope.driver_id
                    }
                }).success(function(data){
                    ngDialog.close();
                    $scope.displaymsg="Vehicle unassigned successfully.";
                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });
                    $scope.$apply();
                }).error(function(data){
                    if(data.status == 401){
                        $state.go('page.login');
                    }
                    else
                    {
                        $scope.errorMsg1 = data.error;
                        $timeout(function(){
                            $scope.errorMsg1 = "";
                        },3000)
                    }
                });
            }

    }
})();