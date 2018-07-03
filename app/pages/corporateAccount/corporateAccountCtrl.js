/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.corporateAccount')
        .controller('corporateAccountCtrl', corporateAccountCtrl);
    function corporateAccountCtrl($timeout, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter) {
        $scope.addcorporateAdmin = {};
        $scope.exportData = function () {
            alasql('SELECT * INTO CSV("corporate.csv",{headers:true}) FROM ?',[$scope.excelList]);
        };

        $http.post(MY_CONSTANT.url + '/list_all_coraporate_admins', {
            access_token: localStorage.getItem('access_token')
        }).success(function (data) {

            var dataArray = [];
            var excelArray =[];
            if (data.status == 200) {

                var cList = data.data.admin_list;
                cList.forEach(function (column) {
                    //==========================================================================================================================
//============================================================ data for excel =============================================
//==========================================================================================================================
                    var e={};

                    e.Corporate_ID = column.user_id;
                    e.Customer_name = column.user_name;
                    e.Email = column.email;
                    e.Active_Members = column.active_members;
                    e.Phone_no = column.phone_no;
                    e.Account_Name =column.account_name;
                    e.Account_Address=column.contact_address;
                    e.PO_Number = column.po_number;
                    e.Total_Amount = column.total_money;
                    e.Amount_Left = column.money_left;
                    excelArray.push(e);

//==========================================================================================================================
//============================================================  end data for excel =============================================
//==========================================================================================================================
                    var d = column;
                    d.invoice_list_url = "/app/invoice-list/" +column.user_id;
                    dataArray.push(d);
                });
                $scope.corporaateList=dataArray;
            }
            else if (data.status == 401) {
                $state.go('page.login');
            }
            else {
                alert(data.message);
            }
        });

        /*--------------------------------------------------------------------------
         * -------------------funtion to open dialog for add corporate account ----------------
         --------------------------------------------------------------------------*/
        $scope.AddCorporateDialog = function () {

            ngDialog.open({
                template: 'modalDialogId',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });
        };


        /*============================================================================
         ==========================funtion to add CORPORATE aCCOUNT==============================
         ============================================================================*/
        $scope.submit = function (addcorporateAdmin) {
            $scope.data1=addcorporateAdmin.email;
            console.log('lenght',$scope.data1.length);
            if($scope.data1[0]=='1' || $scope.data1[0]=='2' || $scope.data1[0]=='3'|| $scope.data1[0]=='0'|| $scope.data1[0]=='4' ||$scope.data1[0]=='5' || $scope.data1[0]=='6' || $scope.data1[0]=='7'|| $scope.data1[0]=='8' || $scope.data1[0]=='9')
            {
                $scope.addcorporateAdmin.errorMsg = 'Email Id is invalid';
                setTimeout(function () {
                    $scope.addcorporateAdmin.errorMsg = "";
                }, 3000);
                return;
            }
            $http.post(MY_CONSTANT.url + '/add_corporate_admin', {
                access_token: localStorage.getItem('access_token'),
                email: addcorporateAdmin.email,
                user_name: addcorporateAdmin.name,
                phone_no: "+" + addcorporateAdmin.phone_no,
                account_name: addcorporateAdmin.account_name,
                //contact_name: addcorporateAdmin.contact_name,
                contact_address: addcorporateAdmin.contact_address,
                po_number: addcorporateAdmin.po_number
                //commission:addcorporateAdmin.commission


            }).success(function (data) {


                if (data.status == 200) {
                    $scope.addcorporateAdmin.successMsg = "Corporate Admin Successfully Added.";

                    setTimeout(function () {
                        $scope.addcorporateAdmin.successMsg = "";

                        ngDialog.close({
                            template: 'modalDialogId',
                            className: 'ngdialog-theme-default',
                            showClose: false,
                            scope: $scope
                        });
                    }, 3000);
                    $state.reload();
                }
                else if (data.status == 401) {
                    $state.go('page.login');
                }
                else {
                    $scope.addcorporateAdmin.errorMsg = data.message;

                    setTimeout(function () {
                        $scope.addcorporateAdmin.errorMsg = "";

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


        /*============================================================================
         ==========================funtion to do payment==============================
         ============================================================================*/
        $scope.pay = function (id,email, amount) {

            $http.post(MY_CONSTANT.url + '/generate_corp_admin_invoice', {
                access_token: localStorage.getItem('access_token'),
                corp_admin_ID: id,
                corp_admin_email: email
            }).success(function (data) {


                if (data.status == 200) {
                    $scope.displaymsg = data.message;
                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        closeByDocument: false,
                        closeByEscape: false,
                        showClose: false
                    })

                }
                else if (data.status == 401) {
                    $state.go('page.login');
                }
                else if(data.error){
                    $scope.displaymsg = data.error;
                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        closeByDocument: false,
                        closeByEscape: false,
                        showClose: false
                    })

                }
                else {
                    $scope.displaymsg = data.message;
                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        closeByDocument: false,
                        closeByEscape: false,
                        showClose: false
                    })

                }
            })
        }


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
         * --------- funtion to open dialog for block or unblock driver ------------
         --------------------------------------------------------------------------*/
        $scope.blockunblockdriver_popup = function (is_blocked, user_id) {

            $scope.blockunblockmsg = '';
            $scope.blockunblockid = user_id;
            $scope.is_blocked = is_blocked;

            if (is_blocked == 1) {
                $scope.blockunblockmsg = "Are you sure you want to block this corporate admin?";
            } else {
                $scope.blockunblockmsg = "Are you sure you want to unblock this corporate admin?";
            }

            ngDialog.open({
                template: 'block_unblock_driver_modalDialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });

        };

        /*--------------------------------------------------------------------------
         * ------------------ funtion to block or unblock driver -------------------
         --------------------------------------------------------------------------*/
        $scope.do_block_unblock_driver = function (is_blocked, blockunblockid) {

            $http.post(MY_CONSTANT.url + '/Block_Unblock_corp_admin',
                {
                    access_token: localStorage.getItem('access_token'),
                    corp_admin_ID: blockunblockid,
                    IsBlock: is_blocked
                }).success(function (data) {


                    if (data.status == 200) {
                        if (is_blocked == 1) {
                            $scope.displaymsg = "Corporate Admin is blocked successfully.";
                        } else {
                            $scope.displaymsg = "Corporate Admin is unblocked successfully.";
                        }
                    }
                    else {
                        $scope.displaymsg = data.message;
                    }

                    ngDialog.close({
                        template: 'block_unblock_driver_modalDialog',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    });

                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope,
                        closeByDocument: false,
                        closeByEscape: false

                    });
                });
        };

        /*--------------------------------------------------------------------------
         * ---------------- funtion to open modal for delete driver ----------------
         --------------------------------------------------------------------------*/
        $scope.deletecorp_dialog = function (delete_corp_id) {

            $scope.delete_corp_id = delete_corp_id;

            ngDialog.open({
                template: 'delete_corp_modalDialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });
        };

        /*--------------------------------------------------------------------------
         * -------------------------funtion to delete driver --------------------------
         --------------------------------------------------------------------------*/
        $scope.deletecorp_admin = function (delete_corp_id) {

            ngDialog.close({
                template: 'delete_corp_modalDialog',
                className: 'ngdialog-theme-default',
                scope: $scope
            });


            $http.post(MY_CONSTANT.url + '/delete_corp_admin',
                {
                    access_token: localStorage.getItem('access_token'),
                    corp_admin_ID: delete_corp_id,
                    isdelete: 1
                }).success(function (data) {


                    if (data.status == 200) {
                        $scope.displaymsg = "Corporate Admin Deleted Successfully.";
                    }
                    else if (data.status == 401) {
                        $state.go('page.login');
                    }
                    else {
                        $scope.displaymsg = data.message;
                    }


                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope,
                        closeByDocument: false,
                        closeByEscape: false

                    });
                });


        };

    }
})();