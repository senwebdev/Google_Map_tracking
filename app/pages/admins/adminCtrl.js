/**
 * Created by tushar on 18/08/2016.
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.admin')
        .controller('adminCtrl', adminCtrl);
    function adminCtrl($timeout, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter) {
        $scope.addAdmin = {};
        $scope.addAdmin.email = '';
        $scope.delete_driver_id = '';
        //type of users
        $scope.type_of_admin=[{
            id:1,
            name: 'Sub Admin'
        },
            {
                id:2,
                name: 'Staff'
            },
            {
                id:3,
                name: 'Partners'
            },
            {
                id:4,
                name: 'Managers'
            }
        ];
        $scope.exportData = function () {
            alasql('SELECT * INTO CSV("adminlist.csv",{headers:true}) FROM ?', [ $scope.excelList]);
        };


        //-----------------get all regions-------------------------
        $.post(MY_CONSTANT.url + '/get_all_regions', {
            access_token: localStorage.getItem('access_token')

        }, function (data) {
            $scope.showloader = false;
            var dataArray1 = [];
            if (typeof(data) == "string")
                data = JSON.parse(data);
            if (data.status == 401) {
                $state.go('page.login');
            }
            else if (data.status == 200) {
                var areaList = data.regions;
                console.log('ief',areaList);
                areaList.forEach(function (column) {
                    var d = {};
                    d.region_id = column.region_id;
                    d.region_name = column.region_name;
                    d.region_path_string = column.region_path_string;

                    dataArray1.push(d);
                });
            }
            $scope.list2=dataArray1;

            console.log('euyfrte',$scope.list2);
            $scope.$digest();
        });


        /*--------------------------------------------------------------------------
         * -------------------funtion to open dialog for add driver ----------------
         --------------------------------------------------------------------------*/
        $scope.AddAdminDialog = function () {
            $scope.addAdmin.email = '';
            ngDialog.open({
                template: 'modalToAddAdmin',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope,
                preCloseCallback: function () {
                    $scope.addAdmin.email='';
                    $scope.addAdmin.name = '';
                    $scope.addAdmin.type_of_admin = '';
                    return true;
                }
            });
        };

        /*--------------------------------------------------------------------------
         * -------------------------funtion to add driver --------------------------
         --------------------------------------------------------------------------*/
        $scope.submit = function (addAdmin) {
            $scope.data1=addAdmin.email;
            console.log('lenght',$scope.data1.length);
            if($scope.data1[0]=='1' || $scope.data1[0]=='2' || $scope.data1[0]=='3'|| $scope.data1[0]=='0'|| $scope.data1[0]=='4' ||$scope.data1[0]=='5' || $scope.data1[0]=='6' || $scope.data1[0]=='7'|| $scope.data1[0]=='8' || $scope.data1[0]=='9')
            {
                $scope.addAdmin.errorMsg = 'Email Id is invalid';
                //$scope.$apply();
                setTimeout(function () {
                    $scope.addAdmin.errorMsg = "";
                    //$scope.$apply();
                }, 3000);
                return;
            }
            $http.post(MY_CONSTANT.url + '/add_super_admin', {
                access_token: localStorage.getItem('access_token'),
                email: addAdmin.email,
                user_name: addAdmin.name,
                type:addAdmin.type_of_admin.id,
                type_name:addAdmin.type_of_admin.name,
                region_id:addAdmin.region_id
            }).success(function (data) {
                //data = JSON.parse(data);

                if (data.status == 200) {
                    $scope.addAdmin.successMsg = "Admin Added Successfully.";
                    //$scope.$apply();
                    setTimeout(function () {
                        $scope.addAdmin.successMsg = "";
                        //$scope.$apply();
                        ngDialog.close({
                            template: 'modalToAddAdmin',
                            className: 'ngdialog-theme-default',
                            showClose: false,
                            scope: $scope
                        });
                    }, 3000);
                    $state.reload();
                }
                else if (data.status == 401){
                    $state.go('page.login');
                }
                else {
                    $scope.addAdmin.errorMsg = data.message;
                    //$scope.$apply();
                    setTimeout(function () {
                        $scope.addAdmin.errorMsg = "";
                        //$scope.$apply();
                        ngDialog.close({
                            template: 'modalToAddAdmin',
                            className: 'ngdialog-theme-default',
                            showClose: false,
                            scope: $scope
                        });
                    }, 3000);
                }
            })
        };

        //var driver_details = function () {
        $http.post(MY_CONSTANT.url + '/view_super_admin', {
            access_token: localStorage.getItem('access_token')
        }).success(function (data) {

            var dataArray = [];
            var excelArray = [];
            //var array=[];
            //data = JSON.parse(data);
            //for(var x=data.data.length-1;x>=0;x--)
            //{
            //    array.push(data.data[x]);
            //}
            if (data.status == 200) {
                var adminList = data.data;
                adminList.forEach(function (column) {
                    var e=column;
                    excelArray.push(e);
                    var d = column;
                    if(column.type==0)
                    {
                        d.type='Super admin';
                    }
                    else if(column.type==1)
                    {
                        d.type='Sub admin';
                    }
                    if(column.type==3)
                    {
                        d.type='Partners';
                    }
                    if(column.type==4)
                    {
                        d.type='Managers';
                    }
                    dataArray.push(d);
                });

                    $scope.list = dataArray;
                    $scope.excelList = excelArray;

                    // Define global instance we'll use to destroy later
                    var dtInstance;

                    $timeout(function () {
                        if (!$.fn.dataTable)
                            return;
                        dtInstance = $('#datatableAdmin').dataTable({
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
                                { 'bSortable': false, 'aTargets': [2] }
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


        /*--------------------------------------------------------------------------
         * ---------------- funtion to open modal for delete admin ----------------
         --------------------------------------------------------------------------*/
        $scope.deleteadmin = function (name,email,id) {

            $scope.delete_admin_name = name;
            $scope.delete_admin_email = email;
            $scope.admin_id  = id;

            ngDialog.open({
                template: 'delete_admin_modalDialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });
        };

        /*--------------------------------------------------------------------------
         * -------------------------funtion to delete admin --------------------------
         --------------------------------------------------------------------------*/
        $scope.delete_admin = function () {

            ngDialog.close({
                template: 'delete_admin_modalDialog',
                className: 'ngdialog-theme-default',
                scope: $scope
            });


            $http.post(MY_CONSTANT.url + '/delete_super_admin',
                {
                    access_token: localStorage.getItem('access_token'),
                    "email": $scope.delete_admin_email,
                    "user_name": $scope.delete_admin_name,
                    "admin_id":$scope.admin_id.toString()
                }).success(function (data) {
                    //data = JSON.parse(data);

                    if (data.status == 200) {
                        $scope.displaymsg = "Admin deleted successfully";
                    }
                    else if (data.status == 401){
                        $state.go('page.login');
                    }
                    else {
                        $scope.displaymsg = data.message;
                    }
                    //$scope.$apply();
                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
                });


        };

    }
})();