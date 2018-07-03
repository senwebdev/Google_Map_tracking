/**
 * Created by tushar on 27/08/2016.
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.vouchers')
        .controller('vouchersCtrl', vouchersCtrl);
    function vouchersCtrl($timeout,$interval, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter, promoService) {

        'use strict';
        $scope.promo_code_id = '';
        $scope.delete_driver_id = '';
        $scope.addVoucher = {};
        $scope.generateVoucher = {};
        $scope.showloader=true;
        $scope.exportData = function () {
            alasql('SELECT * INTO CSV("voucher.csv",{headers:true}) FROM ?',[$scope.excelList]);
        };
        $scope.selectVoucherType=[{
            id:0,
            name: 'Redeemed',
            color:'#000'
        },
            {
                id:1,
                name: 'Active',
                color:'#27c24c'
            },
            {
                id:2,
                name: 'Expired',
                color:'#ff902b'
            }
        ];
        //datepicker
        var start = new Date();
        start.setHours(start.getHours() + 1);
        start = new Date(start);

        start.setMinutes(start.getMinutes() + 4);
        start = new Date(start);

        //e.setDate(start.getDate() + 3);
        var dtInstance;
        $scope.loadData = function() {

            $timeout(function () {
                if ($.fn.DataTable.isDataTable("#dataTableVoucher")) {
                    $('#dataTableVoucher').DataTable().clear().destroy();
                }
                if (!$.fn.dataTable) return;
                dtInstance = $('#datatableVoucher').dataTable({

                    'paging': true,  // Table pagination
                    'ordering': true,  // Column ordering
                    'info': true,  // Bottom left status text
                    // Text translation options
                    // Note the required keywords between underscores (e.g _MENU_)
                    "bServerSide": true,
                    sAjaxSource: MY_CONSTANT.url + "/view_all_vouchers?access_token=" + localStorage.getItem('access_token'),
                    oLanguage: {
                        sSearch: 'Search all columns:',
                        sLengthMenu: '_MENU_ records per page',
                        info: 'Showing page _PAGE_ of _PAGES_',
                        zeroRecords: 'Nothing found - sorry',
                        infoEmpty: 'No records available',
                        infoFiltered: '(filtered from _MAX_ total records)'
                    }, //0-redeemed  1 -active 2 -expired
                    "aoColumnDefs": [
                        {'bSortable': false, 'aTargets': [5, 8]},
                        {
                            render: function (data, type, row) {
                                data = moment(data).format("DD-MM-YYYY");
                                return data;
                            }, 'aTargets': [4]
                        },
                        {
                            render: function (data, type, row) {
                                data = moment(data).format("DD-MM-YYYY hh:mm:ss");
                                if (data == 'Invalid date') {
                                    data = "N/A"
                                }
                                return data;
                            }, 'aTargets': [7]
                        },

                        {
                            render: function (data, type, row) {
                                if (data == 1) {  //active
                                    return '<span class="fa fa-circle online"></span>';
                                }
                                else if (data == 2) {   //expired
                                    return '<span class="fa fa-circle warning"></span>';
                                }
                                else if (data == 0) {   //redeemed
                                    return '<span class="fa fa-circle inverse"></span>';
                                }
                                // return (data * 0.621371).toFixed(1);
                            }, 'aTargets': [5]
                        }
                    ]

                });
                $scope.showloader = false;


                var inputSearchClass = 'datatable_input_col_search';
                var columnInputs = $('tfoot .' + inputSearchClass);

                // On input keyup trigger filtering
                columnInputs
                    .keyup(function () {
                        dtInstance.fnFilter(this.value, columnInputs.index(this));
                    });

                /* var oTable = document.getElementById('datatableVoucher');

                 //gets rows of table
                 var rowLength = oTable.rows.length;

                 //loops through rows
                 for (var i = 0; i < rowLength-1; i++){

                 //gets cells of current row
                 var oCells = oTable.rows.item(i).cells;

                 //gets amount of cells of current row
                 var cellLength = oCells.length;

                 //loops through each cell in current row
                 for(var j = 0; j < cellLength; j++){
                 /!* get your cell info here *!/
                 var cellVal = oCells.item(j).innerHTML;
                 }
                 }*/
            }, 1);
        };
        $scope.loadData();

        //===========================================================
        //                 APPLY FILTER FUNCTION
        //============================================================
        $scope.addFilter = function(status){
            if ($.fn.DataTable.isDataTable("#dataTableVoucher")) {
                $('#dataTableVoucher').DataTable().clear().destroy();
            }
            console.log(status+"status");
            $scope.status=status;
            if (!$.fn.dataTable) return;
            dtInstance = $('#dataTableVoucher').dataTable({
                'paging': true,  // Table pagination
                'ordering': true,  // Column ordering
                'info': true,  // Bottom left status text
                // Text translation options
                // Note the required keywords between underscores (e.g _MENU_)
                "bServerSide": true,
                sAjaxSource: MY_CONSTANT.url + "/view_all_vouchers?access_token=" + localStorage.getItem('access_token')+"&is_apply_filter=1&status="+status,
                oLanguage: {
                    sSearch: 'Search all columns:',
                    sLengthMenu: '_MENU_ records per page',
                    info: 'Showing page _PAGE_ of _PAGES_',
                    zeroRecords: 'Nothing found - sorry',
                    infoEmpty: 'No records available',
                    infoFiltered: '(filtered from _MAX_ total records)'
                },
                "aoColumnDefs": [
                    { 'bSortable': false, 'aTargets': [5,8] },
                    {render: function ( data, type, row ) {
                        data = moment(data).format("DD-MM-YYYY") ;
                        return data;
                    }, 'aTargets': [4] },
                    {render: function ( data, type, row ) {
                        data = moment(data).format("DD-MM-YYYY hh:mm:ss") ;
                        if(data=='Invalid date'){
                            data = "N/A"
                        }
                        return data;
                    }, 'aTargets': [7] },

                    {render: function ( data, type, row ) {
                        if(data==1){
                            return '<span class="fa fa-circle online"></span>';
                        }
                        else if(data==2){
                            return '<span class="fa fa-circle warning"></span>';
                        }
                        else if(data==0){
                            return '<span class="fa fa-circle inverse"></span>';
                        }
                        // return (data * 0.621371).toFixed(1);
                    }, 'aTargets': [5] }
                ]

            });
            var inputSearchClass = 'datatable_input_col_search';
            var columnInputs = $('tfoot .' + inputSearchClass);

            // On input keyup trigger filtering
            columnInputs
                .keyup(function () {
                    dtInstance.fnFilter(this.value, columnInputs.index(this));
                });

            var oTable = document.getElementById('dataTableVoucher');

//gets rows of table
            var rowLength = oTable.rows.length;

//loops through rows
            for (var i = 0; i < rowLength-1; i++){

                //gets cells of current row
                var oCells = oTable.rows.item(i).cells;

                //gets amount of cells of current row
                var cellLength = oCells.length;

                //loops through each cell in current row
                for(var j = 0; j < cellLength; j++){
                    /* get your cell info here */
                    var cellVal = oCells.item(j).innerHTML;
                    console.log(cellVal);
                }
            }



        };
        //================================================================
        //                    remove filter
        //================================================================
        $scope.removeFilter = function(){
            $state.reload();
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


        /*--------------------------------------------------------------------------
         * ---------------- funtion to open modal for delete promo code ------------
         --------------------------------------------------------------------------*/
        $scope.deletePromocode_popup = function (promo_code_id) {

            $scope.promo_code_id = promo_code_id;

            ngDialog.open({
                template: 'delete_promocode_modalDialog',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope
            });
        };
        /*--------------------------------------------------------------------------
         * ---------------- funtion to add promo code ------------------------------
         --------------------------------------------------------------------------*/
        $scope.AddVoucherDialog = function () {
            ngDialog.open({
                template: 'add_voucher',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope,
                preCloseCallback: function () {
                    $scope.addVoucher = {};
                    return true;
                }
            });
            $scope.$on('ngDialog.opened', function (e, element) {
                $('#voucher_expiry_date').datepicker({
                    format: 'yyyy/mm/dd',
                    startDate:new Date(),
                    autoclose: true
                });
            });
        };

        /*--------------------------------------------------------------------------
         * ---------------- funtion to genrate vouchers code ------------------------------
         --------------------------------------------------------------------------*/
        $scope.generateVoucherDialog = function () {
            ngDialog.open({
                template: 'generate_voucher',
                className: 'ngdialog-theme-default',
                showClose: false,
                scope: $scope,
                preCloseCallback: function () {
                    $scope.generateVoucher = {};
                    return true;
                }
            });
            $scope.$on('ngDialog.opened', function (e, element) {
                $('#gvoucher_expiry_date').datepicker({
                    format: 'yyyy/mm/dd',
                    startDate:new Date(),
                    autoclose: true
                });
            });
        };
        //$("#voucherCsv").click(function() {
        //
        //    $("#voucherCsv").attr("href", MY_CONSTANT.url + "/view_all_vouchers?access_token=" + localStorage.getItem('access_token') + "&is_apply_filter=1&csv=1");
        //    $("#voucherCsv").attr("href", MY_CONSTANT.url + "/view_all_vouchers?access_token=" + localStorage.getItem('access_token') + "&is_apply_filter=1&csv=1&status=" + $scope.status);
        //});



        /*--------------------------------------------------------------------------
         ------------------- function to export data according to filters ----------
         --------------------------------------------------------------------------*/

        $("#voucherCsv").click(function() {
            if (status) {
                $("#voucherCsv").attr("href", MY_CONSTANT.url + "/view_all_vouchers?access_token=" + localStorage.getItem('access_token')+"&is_apply_filter=1&csv=1&status=" + $scope.status);        }
            else
                $("#voucherCsv").attr("href", MY_CONSTANT.url + "/view_all_vouchers?access_token=" + localStorage.getItem('access_token')+"&is_apply_filter=1&csv=1");

        });

        /*--------------------------------------------------------------------------
         ------------ end of function to export data according to filters ----------
         --------------------------------------------------------------------------*/
        //====================================================================================
        //==================================add voucher referral code ===============================
        //====================================================================================

        $scope.submitAddVoucher = function(data){
            console.log(data);
            var expiry_date = new Date(data.voucher_expiry_date);
            expiry_date = expiry_date.toUTCString();
            $.post(MY_CONSTANT.url + '/add_voucher',
                {
                    access_token: localStorage.getItem('access_token'),
                    voucher_name:data.voucher_name,
                    voucher_description:data.voucher_description,
                    voucher_amount:data.voucher_amount.toString(),
                    expiry_date:expiry_date



                }, function (data) {
                    if(typeof(data)=='string'){
                        // data = JSON.parse(data);
                    }

                    console.log(data);

                    if (data.status == 200) {
                        $scope.addVoucher.successMsg = "Voucher Added Successfully.";

                    }

                    else if (data.status == 401){
                        $state.go('page.login');
                    }
                    else{
                        $scope.addVoucher.errorMsg = data.message;

                    }
                    $scope.$apply();
                    setTimeout(function () {
                        $scope.addVoucher.successMsg = "";
                        $scope.addVoucher.errorMsg = "";
                        $scope.$apply();
                        ngDialog.close({
                            template: 'add_voucher',
                            className: 'ngdialog-theme-default',
                            showClose: false,
                            scope: $scope

                        });
                    }, 3000);

                    $state.reload();
                });


        }

        //====================================================================================
        //============================generate voucher code ==================================
        //====================================================================================

        $scope.submitGenerateVoucher = function(data){
            console.log(data);
            var expiry_date = new Date(data.voucher_expiry_date);
            expiry_date = expiry_date.toUTCString();
            $.post(MY_CONSTANT.url + '/generate_voucher',
                {
                    access_token: localStorage.getItem('access_token'),
                    voucher_name:data.voucher_name,
                    voucher_description:data.voucher_description,
                    voucher_amount:data.voucher_amount.toString(),
                    expiry_date:expiry_date,
                    no_of_voucher:data.no_of_vouchers.toString()
                }, function (data) {
                    console.log(data);
                    //if(typeof(data)=='string'){
                    // //    data = JSON.parse(data);
                    //}
                    if (data.status == 200) {
                        $scope.generateVoucher.successMsg = "Voucher Added Successfully.";

                    }

                    else if (data.status == 401){
                        $state.go('page.login');
                    }
                    else{
                        $scope.generateVoucher.errorMsg = data.message;

                    }
                    $scope.$apply();
                    setTimeout(function () {
                        $scope.generateVoucher.successMsg = "";
                        $scope.generateVoucher.errorMsg = "";
                        $scope.$apply();
                        ngDialog.close({
                            template: 'generate_voucher',
                            className: 'ngdialog-theme-default',
                            showClose: false,
                            scope: $scope

                        });
                    }, 3000);


                });


        }
        /*--------------------------------------------------------------------------
         * -------------------funtion to edit voucher code ---------------
         --------------------------------------------------------------------------*/
        $('#dataTableVoucher').on('click', '.editVoucher', function(e) {
            console.log(e.currentTarget.id);

            $scope.voucher_id= e.currentTarget.id;
            $.post(MY_CONSTANT.url + '/view_voucher',
                {
                    access_token: localStorage.getItem('access_token'),
                    voucher_id: $scope.voucher_id.toString()
                }, function (data) {
                    if(typeof(data)=="string")
                        // data = JSON.parse(data);
                    if (data.status == 200) {
                        $scope.editVoucher = {
                            voucher_name:data.data.voucher_name,
                            voucher_description:data.data.voucher_description,
                            voucher_amount:data.data.voucher_amount,
                            voucher_expiry_date:moment(data.data.expiry_date).format("YYYY/MM/DD")
                        }
                        ngDialog.open({
                            template: 'edit_voucher',
                            className: 'ngdialog-theme-default',
                            scope: $scope,
                            closeByDocument: false,
                            closeByEscape: false,
                            showClose:false
                        });
                    }

                    else if (data.status == 401){
                        $state.go('page.login');
                    }
                });



            $scope.$on('ngDialog.opened', function (e, element) {
                $('#evoucher_expiry_date').datepicker({
                    format: 'yyyy/mm/dd',
                    startDate:new Date(),
                    autoclose: true
                });
            });


        });
        $('#dataTableVoucher').on('keypress', '.editVoucher', function(e) {

            var code = e.keyCode || e.which;
            if( code === 13 ) {
                e.preventDefault();
                return false;
            }
        });
        $scope.submitEditVoucher = function (data) {
            console.log(data);
            var expiry_date = new Date(data.voucher_expiry_date);
            expiry_date = expiry_date.toUTCString();

            $.post(MY_CONSTANT.url + '/edit_voucher',
                {
                    access_token: localStorage.getItem('access_token'),
                    voucher_id: $scope.voucher_id.toString(),
                    voucher_name:data.voucher_name,
                    voucher_description:data.voucher_description,
                    voucher_amount:data.voucher_amount.toString(),
                    expiry_date:expiry_date
                }, function (data) {
                    if(typeof(data)=="string")
                        // data = JSON.parse(data);

                    if (data.status == 200) {
                        $scope.displaymsg = "Voucher has been edited successfully.";

                    }

                    else if (data.status == 401){
                        $state.go('page.login');
                    }
                    else {
                        $scope.displaymsg = data.message;
                    }
                    $scope.$apply();
                    ngDialog.close({
                        template: 'edit_voucher',
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
        /*--------------------------------------------------------------------------
         * -------------------funtion to delte voucher code ---------------
         --------------------------------------------------------------------------*/
        $('#dataTableVoucher').on('click', '.deleteVoucher', function(e) {
            console.log(e.currentTarget.id);

            $scope.voucher_id= e.currentTarget.id;


            ngDialog.open({
                template: 'delete_voucher_modalDialog',
                className: 'ngdialog-theme-default',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false,
                showClose:false
            });

        });
        $('#dataTableVoucher').on('keypress', '.deleteVoucher', function(e) {

            var code = e.keyCode || e.which;
            if( code === 13 ) {
                e.preventDefault();
                return false;
            }
        });
        /*--------------------------------------------------------------------------
         * -------------------------funtion to delete promo code -------------------
         --------------------------------------------------------------------------*/
        $scope.deleteVoucher = function (id) {

            ngDialog.close({
                template: 'delete_voucher_modalDialog',
                className: 'ngdialog-theme-default',
                scope: $scope
            });

            $.post(MY_CONSTANT.url + '/delete_voucher',
                {
                    access_token: localStorage.getItem('access_token'),
                    voucher_id: id.toString()
                }, function (data) {
                    if(typeof(data)=="string")
                        // data = JSON.parse(data);

                    if (data.status == 200) {
                        $scope.displaymsg = "Voucher deleted successfully.";
                    }

                    else if (data.status == 401){
                        $state.go('page.login');
                    }
                    else {
                        $scope.displaymsg = data.message;
                    }
                    $scope.$apply();
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