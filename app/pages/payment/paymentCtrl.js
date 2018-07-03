/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.payment')
        .controller('paymentCtrl', paymentCtrl);
    function paymentCtrl($timeout, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter) {
        $scope.exportData = function () {
            alasql('SELECT * INTO CSV("payment.csv",{headers:true}) FROM ?',[$scope.excelList]);
        };
        $http.post(MY_CONSTANT.url + '/driver_payment_details', {
            access_token: localStorage.getItem('access_token')

        }).success(function (data) {
            var dataArray = [];
            var excelArray = [];
            if (data.status == 200) {
                var driverList = data.data.driver_data;
                driverList.forEach(function (column) {
                    var e = column;
                    excelArray.push(e);

                    var d = column;
                    d.paid_payments = column.driver_paid_payments;
                    d.actual_remaining_Amount = column.remaining_amount_paid_to_driver;
                    d.remaining_Amount = column.remaining_amount_paid_to_driver;
                    d.cash_earnings = column.driver_cash_earnings;
                    var num = column.remaining_amount_paid_to_driver;
                    if(d.remaining_Amount >= 0){
                        //console.log(column.remaining_amount_paid_to_driver)
                        d.payment_status = "Pay"
                    }
                    else{
                        d.payment_status = "Collect"
                    }
                    dataArray.push(d);

                });
                $scope.list = dataArray;
                var dtInstance;

                $timeout(function () {
                    if (!$.fn.dataTable)
                        return;
                    dtInstance = $('#datatablePayment').dataTable({
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
         * --------- funtion for pay amount ----------------------------------------
         --------------------------------------------------------------------------*/
        $scope.pay = function (driverId,actual_remaining_Amount, amount) {

            var textNumber = /((\d+)((\.\d{1,2})?))$/;

            if(amount > actual_remaining_Amount || !(textNumber.test(amount)) || amount == ""){
                $scope.displaymsg = "Please enter valid amount";
                ngDialog.open({
                    template: 'display_msg_modalDialog',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope
                });
            }
            else {
                $http.post(MY_CONSTANT.url + '/payDriver',
                    {
                        access_token: localStorage.getItem('access_token'),
                        driver_id: driverId,
                        amount: amount
                    }).success(function (data) {


                        if (data.status == 200) {
                            $scope.displaymsg = "Payment done successfully.";
                            ngDialog.open({
                                template: 'display_msg_modalDialog',
                                className: 'ngdialog-theme-default',
                                showClose: false,
                                scope: $scope
                            });
                        }
                        else if (data.status == 401){
                            $state.go('page.login');
                        }
                        else{
                            $scope.displaymsg = "Something went wrong.";
                            ngDialog.open({
                                template: 'display_msg_modalDialog',
                                className: 'ngdialog-theme-default',
                                showClose: false,
                                scope: $scope
                            });
                        }

                        //payment_details();
                    });
            }
        };

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
    }
})();