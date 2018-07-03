/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.rides.completedRides')
        .controller('completedRidesCtrl', completedRidesCtrl);
    function completedRidesCtrl($timeout,$rootScope, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter) {
        /*App.controller('RidesController', function ($scope,$state, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout,ngDialog,responseCode) {
*/
//             'use strict';
//             $scope.is_driver = 0;
//             $scope.is_customer = 0;
//             $scope.start_date = "0/0/0";
//             $scope.end_date = "0/0/0";
//             $scope.is_apply_filter = 0;
//             $scope.driver_name = "";
//             $scope.customer_name = "";
//             $scope.rides = {};
//             //type of USER
//             $scope.select_user=[{
//                 id:0,
//                 name: 'Driver'
//             },
//                 {
//                     id:1,
//                     name: 'Customer'
//                 }
//             ];
//
//             $scope.showloader=true;
//             /*if($cookieStore.get('type')==2){
//                 $scope.showcsvbtn = 0;
//             }
//             else
//             {
//                 $scope.showcsvbtn = 1;
//             }*/
//
//             $scope.minDate = new Date();
//             $scope.maxDate = new Date();
//
//             $scope.today = function() {
//                 $scope.rides.start_date = new Date();
//             };
//
//             $scope.clear = function () {
//                 $scope.rides.start_date = null;
//             };
//
//
//             $scope.toggleMin = function() {
//                 $scope.minDate = $scope.minDate ? null : new Date();
//             };
//             $scope.toggleMin();
//             $scope.popup={};
//             $scope.open = function($event) {
//                     $event.preventDefault();
//                     $event.stopPropagation();
//                     console.log('a');
//                     $scope.opened = true;
//                     $scope.opened1=false;
//             };
//
//             $scope.dateOptions = {
//                 formatYear: 'yy',
//                 startingDay: 1
//             };
//
//             $scope.initDate = new Date();
//             $scope.format = 'yyyy/MM/d';
//
//
//
//             $scope.today = function() {
//                 $scope.ride.end_date = new Date();
//             };
//             //$scope.today();
//
//             $scope.clear = function () {
//                 $scope.ride.end_date = null;
//             };
//
//             //// Disable weekend selection
//             //$scope.disabled = function(date, mode) {
//             //    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
//             //};
//
//             $scope.toggleMin = function() {
//                 $scope.minDate = $scope.minDate ? null : new Date();
//             };
//             $scope.toggleMin();
//
//             $scope.open1 = function($event) {
//                 $event.preventDefault();
//                 $event.stopPropagation();
//
//                 $scope.opened1 = true;
//                 $scope.opened = false;
//
//             };
//         $scope.current=new Date();
//         $scope.tomoro=new Date();
//         $scope.tomoro.setDate($scope.tomoro.getDate()+1);
//         $scope.dt = $scope.tomoro;
//         $scope.inlineOptions = {
//
//             minDate: new Date(),
//             showWeeks: true
//         };
//
//         $scope.dateOptions = {
//             startingDay: 0
//         };
//         $scope.popup1 = {
//             opened: false
//         };
//         $scope.open1 = function() {
//             $scope.popup1.opened = true;
//         };
//         $scope.altInputFormats = ['M!/d!/yyyy'];
//         $scope.dateOptions = {
//                 startingDay: 1
//             };
//
//             $scope.initDate = new Date();
//             $scope.format = 'yyyy/MM/d';
//
//
//
//             var dtInstance;
//             var d = new Date((new Date()).getTime());
//             var offset = d.getTimezoneOffset();
//
//             /*-- function to export data according to filters --*/
//
//             $("#ridescsv").click(function() {
//
//                 var start_date = '';
//                 var end_date = '';
//                 //
//                 // if(end_date)
//                 //     end_date.setDate(end_date.getDate() + 1);
//                 // var days = end_date - start_date;
//                 //
//                 // if(($scope.rides.end_date != undefined) && ($scope.rides.start_date == '' || $scope.rides.start_date == undefined || $scope.rides.start_date == null)){
//                 //     $scope.errorMsg = "Please select start date";
//                 //     $scope.TimeOutError();
//                 //     return false;
//                 // }
//                 // if(($scope.rides.start_date != undefined) && ($scope.rides.end_date == '' || $scope.rides.end_date == undefined || $scope.rides.end_date == null)){
//                 //     $scope.errorMsg = "Please select End Date";
//                 //     $scope.TimeOutError();
//                 //     return false;
//                 // }
//                 // if (($scope.rides.end_date != undefined) && ($scope.rides.start_date != undefined) && days <= 0) {
//                 //     $scope.errorMsg = "Start Date must be less than End Date";
//                 //     $scope.TimeOutError();
//                 //     return false;
//                 // }
//                 if(typeof $scope.dates.dates2=="string")
//                 {
//                     var r=$scope.dates.dates2.split(' - ');
//                     console.log(r);
//                     $scope.rides.start_date=r[0];
//                     $scope.rides.end_date=r[1];
//                     console.log($scope.rides.start_date);
//                     console.log($scope.rides.end_date);
//                     start_date = $scope.rides.start_date;
//                     end_date = $scope.rides.end_date;
//                     start_date = new Date(start_date);
//                     end_date = new Date(end_date);
//                     console.log(start_date);
//                     console.log(end_date);
//
//                 }
//                 else {
//                     $scope.rides.start_date=$scope.dates.dates2.startDate;
//                     $scope.rides.end_date=$scope.dates.dates2.endDate;
//                     console.log($scope.dates.dates2);
//                     start_date=$scope.rides.start_date;
//                     end_date=$scope.rides.end_date;
//                     console.log(start_date);
//                     console.log(end_date);
//                 }
//                 start_date = start_date.toUTCString();
//                 end_date = end_date.toUTCString();
//
//                 console.log(start_date);
//                 console.log(end_date);
//                 if (start_date && end_date) {
//
//                     $("#ridescsv").attr("href", MY_CONSTANT.url + "/all_rides?access_token=" + localStorage.getItem('access_token') + "&timezone=" + offset + "&csv=1" + "&driver_name=" + $scope.driver_name + "&customer_name=" + $scope.customer_name + "&is_apply_filter=1&start_date=" + start_date + "&end_date=" + end_date);
//                 }
//                 else {
//                     $("#ridescsv").attr("href", MY_CONSTANT.url + "/all_rides?access_token=" + localStorage.getItem('access_token') + "&timezone=" + offset + "&csv=1");
//                 }
//
//             });
//
//             /*--- end of function to export data according to filters ---*/
//
//             //===============================================================
//             //                 DISPLAY TIME IN FORMAT
//             //================================================================
//             $scope.timeFormat = function(date){
//                 //console.log(date);
//                 date = date.split(":")
//                 var hours = date[0];
//                 var minutes = date[1];
//                 var seconds = date[2];
//                 var ampm = hours >= 12 ? 'PM' : 'AM';
//                 hours = hours % 12;
//                 hours = hours ? hours : 12; // the hour '0' should be '12'
//                 hours = hours < 10 ? '0'+hours : hours;
//                 minutes = minutes < 10 ? '0'+minutes : minutes;
//                 seconds = seconds < 10 ? '0'+seconds : seconds;
//                 var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
//                 return strTime;
//             };
//
//             //$timeout(function () {
//             $scope.loadData = function() {
//                 $timeout(function () {
//                     /* if ($.fn.DataTable.isDataTable("#datatableAll")) {
//                      $('#datatableAll').DataTable().clear().destroy();
//                      }*/
//                     if (!$.fn.dataTable) return;
//                     dtInstance = $('#datatableAll').dataTable({
//
//                         'paging': true,  // Table pagination
//                         'ordering': true,  // Column ordering
//                         'info': true,  // Bottom left status text,
//                         "order": [[0, "desc"]],
//                         // Text translation options
//                         // Note the required keywords between underscores (e.g _MENU_)
//                         "bServerSide": true,
//                         sAjaxSource: MY_CONSTANT.url + "/all_rides?access_token=" + localStorage.getItem('access_token') + "&is_apply_filter=0&timezone=" + offset,
//                         oLanguage: {
//                             sSearch: 'Search all columns:',
//                             sLengthMenu: '_MENU_ records per page',
//                             info: 'Showing page _PAGE_ of _PAGES_',
//                             zeroRecords: 'Nothing found - sorry',
//                             infoEmpty: 'No records available',
//                             infoFiltered: '(filtered from _MAX_ total records)'
//                         },
//                         "aoColumnDefs": [
//                             {
//                                 render: function (data, type, row) {
//                                     var dateString = data.split(" ")
//                                     var timeString = $scope.timeFormat(dateString[1]);
//                                     data = dateString[0] + " " + timeString;
//                                     return data;
//                                 }, 'aTargets': [1]
//                             },
//                             {
//                                 render: function (data, type, row) {
//                                     if (data != 'N/A') {
//                                         var dateString = data.split(" ")
//                                         var timeString = $scope.timeFormat(dateString[1]);
//                                         data = dateString[0] + " " + timeString;
//                                         //console.log(data);
//                                         return data;
//                                     }
//                                     else {
//                                         return data;
//                                     }
//                                 }, 'aTargets': [8]
//                             },
//                             {
//                                 render: function (data, type, row) {
//                                     if (data != 'N/A') {
//                                         var dateString = data.split(" ")
//                                         var timeString = $scope.timeFormat(dateString[1]);
//                                         data = dateString[0] + " " + timeString;
//                                         //console.log(data);
//                                         return data;
//                                     }
//                                     else {
//                                         return data;
//                                     }
//                                 }, 'aTargets': [10]
//                             },
//
//                         ], "drawCallback": function() {
//                             var api = this.api();
//                             api.$('.editRide').click(function(e) {
//                                 console.log("in function editRide")
//                                 $scope.editRide(e);
//                             });
//                         }
//
//
//                     });
//                     $scope.showloader = false;
//
//
//                     var inputSearchClass = 'datatable_input_col_search';
//                     var columnInputs = $('tfoot .' + inputSearchClass);
//
//                     // On input keyup trigger filtering
//                     columnInputs
//                         .keyup(function () {
//                             dtInstance.fnFilter(this.value, columnInputs.index(this));
//                         });
//
//                     /* var oTable = document.getElementById('datatableAll');
//
//                      //gets rows of table
//                      var rowLength = oTable.rows.length;
//
//                      //loops through rows
//                      for (var i = 0; i < rowLength-1; i++){
//
//                      //gets cells of current row
//                      var oCells = oTable.rows.item(i).cells;
//
//                      //gets amount of cells of current row
//                      var cellLength = oCells.length;
//
//                      //loops through each cell in current row
//                      for(var j = 0; j < cellLength; j++){
//                      /!* get your cell info here *!/
//                      var cellVal = oCells.item(j).innerHTML;
//                      }
//                      }*/
//                 })
//             }
//
//
//
//
//             //});
//             $scope.loadData();
//
//             // When scope is destroyed we unload all DT instances
//             // Also ColVis requires special attention since it attaches
//             // elements to body and will not be removed after unload DT
//             $scope.$on('$destroy', function () {
//                 dtInstance.fnDestroy();
//                 $('[class*=ColVis]').remove();
//             });
//
//             //===========================================================
//             //                 APPLY FILTER FUNCTION
//             //============================================================
//         var d=new Date();
//         console.log(moment(d).format('YYYY-MM-DD'));
//         $('.applyBtn').click(function(){
//             $scope.dateFilter();
//         });
//         $scope.dateFilter=function(){
//             console.log($scope.dates.dates2);
//             //$scope.$apply();
//             console.log('as');
//            // $scope.changeDate();
//         };
//         $scope.dates={};
//         $scope.dates.dates2 = { startDate: moment('2016-08-01'), endDate: moment(d) };
//
//
//
//
//
//
//
//
//
//             $scope.addfilter = function(){
//                 //$scope.is_apply_filter = 1;
//                 console.log($scope.dates.dates2);
//                 console.log(typeof $scope.dates.dates2);
//                 $scope.rides.start_date='';
//                 $scope.rides.end_date='';
//                 var start_date='';
//                 var end_date='';
//                 if(typeof $scope.dates.dates2=="string")
//                 {
//                     var r=$scope.dates.dates2.split(' - ');
//                     console.log(r);
//                     $scope.rides.start_date=r[0];
//                     $scope.rides.end_date=r[1];
//                     console.log($scope.rides.start_date);
//                     console.log($scope.rides.end_date);
//                     start_date = $scope.rides.start_date;
//                     end_date = $scope.rides.end_date;
//                     start_date = new Date(start_date);
//                     end_date = new Date(end_date);
//                     console.log(start_date);
//                     console.log(end_date);
//
//                 }
//                 else {
//                     $scope.rides.start_date=$scope.dates.dates2.startDate;
//                     $scope.rides.end_date=$scope.dates.dates2.endDate;
//                     console.log($scope.dates.dates2);
//                     start_date=$scope.rides.start_date;
//                     end_date=$scope.rides.end_date;
//                     console.log(start_date);
//                     console.log(end_date);
//                 }
//
//
//                 //if(end_date)
//                 //    end_date.setDate(end_date.getDate() + 1);
//                 //var days = end_date - start_date;
//                 //
//                 //if($scope.rides.start_date == '' || $scope.rides.start_date == undefined || $scope.rides.start_date == null){
//                 //    $scope.errorMsg = "Please select start date";
//                 //    $scope.TimeOutError();
//                 //    return false;
//                 //}
//                 //if($scope.rides.end_date == '' || $scope.rides.end_date == undefined || $scope.rides.end_date == null){
//                 //    $scope.errorMsg = "Please select End Date";
//                 //    $scope.TimeOutError();
//                 //    return false;
//                 //}
//                 //if (days <= 0) {
//                 //    $scope.errorMsg = "Start Date must be less than End Date";
//                 //    $scope.TimeOutError();
//                 //    return false;
//                 //}
//
//
//                 //var start_date = $("#start_date").val();
//                 //var end_date = $("#end_date").val();
//                 //start_date = start_date + " 00:00:00";
//                 //var start_date = new Date(start_date);
//                 console.log('start',start_date);
//                 start_date = start_date.toUTCString();
//                 console.log('start',start_date);
//
//                 //end_date = end_date + " 23:59:00";
//                 //end_date = new Date(end_date);
//                 //console.log('start',end_date);
//                 end_date = end_date.toUTCString();
//                 console.log('start',end_date);
//                 if((!angular.isUndefined($scope.rides.user)) || $scope.rides.user !=null){
//                     if($scope.rides.user==0){
//                         if(!angular.isUndefined($scope.rides.user_name)){
//                             $scope.driver_name = $scope.rides.user_name;
//                             $scope.customer_name = "";
//                         }
//
//                     }
//                     else if($scope.rides.user==1){
//                         if(!angular.isUndefined($scope.rides.user_name)){
//                             $scope.driver_name = "";
//                             $scope.customer_name = $scope.rides.user_name;
//                         }
//                     }
//                 }
//                 else{
//                     $scope.driver_name = "";      //in case of nothing is selected
//                     $scope.customer_name = "";
//                 }
//
//
//                 if ($.fn.DataTable.isDataTable("#datatableAll")) {
//                     $('#datatableAll').DataTable().clear().destroy();
//                 }
//
//
//
//
//                 if (!$.fn.dataTable) return;
//                 dtInstance = $('#datatableAll').dataTable({
//                     'paging': true,  // Table pagination
//                     'ordering': true,  // Column ordering
//                     'info': true,  // Bottom left status text
//                     "order": [[ 0, "desc" ]],
//                     // Text translation options
//                     // Note the required keywords between underscores (e.g _MENU_)
//                     "bServerSide": true,
//                     sAjaxSource: MY_CONSTANT.url + "/all_rides?access_token=" + localStorage.getItem('access_token') +"&driver_name="+$scope.driver_name+ "&customer_name="+$scope.customer_name+"&is_apply_filter=1&start_date="+start_date+"&end_date="+end_date + "&timezone=" + offset,
//                     oLanguage: {
//                         sSearch: 'Search all columns:',
//                         sLengthMenu: '_MENU_ records per page',
//                         info: 'Showing page _PAGE_ of _PAGES_',
//                         zeroRecords: 'Nothing found - sorry',
//                         infoEmpty: 'No records available',
//                         infoFiltered: '(filtered from _MAX_ total records)'
//                     },
//                     "aoColumnDefs": [
//                         {
//                             render: function ( data, type, row ) {
//                                 var dateString = data.split(" ")
//                                 var timeString  = $scope.timeFormat(dateString[1]);
//                                 data = dateString[0]+" "+ timeString;
//                                 console.log(data);
//                                 return data;
//                             }, 'aTargets': [1] },
//                         {
//                             render: function ( data, type, row ) {
//                                 if(data !='N/A'){
//                                     var dateString = data.split(" ")
//                                     var timeString  = $scope.timeFormat(dateString[1]);
//                                     data = dateString[0]+" "+ timeString;
//                                     console.log(data);
//                                     return data;
//                                 }
//                                 else{
//                                     return data;
//                                 }
//                             }, 'aTargets': [8] },
//                         {
//                             render: function ( data, type, row ) {
//                                 if(data !='N/A'){
//                                     var dateString = data.split(" ")
//                                     var timeString  = $scope.timeFormat(dateString[1]);
//                                     data = dateString[0]+" "+ timeString;
//                                     console.log(data);
//                                     return data;
//                                 }
//                                 else{
//                                     return data;
//                                 }
//                             }, 'aTargets': [10] },
//                     ],
//                     "drawCallback": function() {
//                         var api = this.api();
//                         api.$('.editRide').click(function(e) {
//                             console.log("in function editRide")
//                             $scope.editRide(e);
//                         });
//                     }
//                 });
//                 var inputSearchClass = 'datatable_input_col_search';
//                 var columnInputs = $('tfoot .' + inputSearchClass);
//
//                 // On input keyup trigger filtering
//                 columnInputs
//                     .keyup(function () {
//                         dtInstance.fnFilter(this.value, columnInputs.index(this));
//                     });
//
//                /* var oTable = document.getElementById('datatableAll');
//
// //gets rows of table
//                 var rowLength = oTable.rows.length;
//
// //loops through rows
//                 for (var i = 0; i < rowLength-1; i++){
//
//                     //gets cells of current row
//                     var oCells = oTable.rows.item(i).cells;
//
//                     //gets amount of cells of current row
//                     var cellLength = oCells.length;
//
//                     //loops through each cell in current row
//                     for(var j = 0; j < cellLength; j++){
//                         /!* get your cell info here *!/
//                         var cellVal = oCells.item(j).innerHTML;
//                     }
//                 }*/
//
//
//
//             }
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $scope.maxSize=5;
        $scope.skip = 0;
        $rootScope.showloader=true;
        var dtInstance;
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
            if($scope.sortByKey!='Sort By')$scope.initTable($scope.sortByKey);
            else  $scope.initTable('sort');
        };
        $scope.sortByKey='Sort By';
        $scope.sortBy = function (s){
          $scope.sortByKey=s.label;
          console.log(s.key);
          dtInstance.fnDestroy();
          $scope.initTable(s.key);
        }
        $scope.completedList=[];
        $scope.initTable = function(s) {
            $('#datatableCompleted').dataTable().fnDestroy();
            //
            var d={
                    access_token: localStorage.getItem('access_token'),
                    limit:10,
                    offset:$scope.skip
                };
            if(s!='sort'){
              d.sort_by=s;
            }
            $.post(MY_CONSTANT.url + '/completed_rides', d)
                .success(function (data, status) {
                    var arr = [];
                    var d = data;
                    console.log(d);
                    $rootScope.showloader=false;
                    $scope.completedList = d.paginated_rides;
                    $scope.totalItems= d.total_rides;
                    if($scope.totalItems==0)return false;
                    $scope.sortByItems=[];
                    var keys = $.map($scope.completedList[0], function(v, i){
                      return i;
                    });
                    // console.log(keys);
                    for(var i=0;i<keys.length;i++){
                      var key_name = keys[i].replace(/_/g, " ");
                      var s={
                          key:keys[i],
                          label:key_name
                        }
                      $scope.sortByItems.push(s);
                    }
                    $scope.$apply(function () {
                    // var dtInstance;
                    $timeout(function () {
                        if (!$.fn.dataTable) return;
                        dtInstance = $('#datatableCompleted').dataTable({
                            'searching': false,
                            'paging': true,  // Table pagination
                            'ordering': true,  // Column ordering
                            'info': true,
                            "bDestroy": true,
                            'scrollY': '500px',
                            'scrollX': '2000px',
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
                    }, 500);

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

        };
        $scope.initTable('sort');
            /*--------------------------------------------------------------------------
             * -------------------funtion to modify Scheduled Rides ---------------
             --------------------------------------------------------------------------*/
            //$('#datatableAll').on('click', '.editRide', function (e) {
            $('#datatableAll .editable').click(function(){

                $scope.engagement_id = $(this).attr('id');
                console.log($scope.engagement_id);
                ngDialog.open({
                    template: 'editride_confirm',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope
                });


            });
            $scope.editRide = function(e){

                $scope.engagement_id = e.currentTarget.id;
                console.log($scope.engagement_id);
                ngDialog.open({
                    template: 'editride_confirm',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope
                });


            };
            $('#datatableAll').on('keypress', '.editRide', function (e) {

                var code = e.keyCode || e.which;
                if (code === 13) {
                    e.preventDefault();
                    return false;
                }
            });


            /*--------------------------------------------------------------------------
             * -------------------funtion to edit  Schedule Ride -------------------
             --------------------------------------------------------------------------*/
            $scope.editRideDialog = function () {

                ngDialog.close({
                    template: 'editride_confirm',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope
                });
                $.post(MY_CONSTANT.url + '/get_ride_by_id', {
                    access_token: localStorage.getItem('access_token'),
                    engagement_id: $scope.engagement_id
                }, function (response) {
                    if (typeof(response) == "string") {
                        response = JSON.parse(response);
                    }
                    if (response.status == 200) {
                        $scope.editRide = {
                            amount_paid: response.data.fare,
                            totalfare: response.data.total_fare,
                            discount: response.data.discount
                        }

                        ngDialog.open({
                            templateUrl: 'edit_ride',
                            className: 'ngdialog-theme-default',
                            showClose: false,
                            scope: $scope
                        });

                    }
                    else {
                        $scope.displaymsg = response.message;
                        ngDialog.open({
                            template: 'display_msg_modalDialog',
                            className: 'ngdialog-theme-default',
                            showClose: false,
                            scope: $scope
                        });
                    }


                });
            }


            $scope.submitEditRide = function (editRide) {
                $.post(MY_CONSTANT.url + '/edit_ride_by_id', {
                    access_token: localStorage.getItem('access_token'),
                    engagement_id: $scope.engagement_id,
                    paid_by_customer:editRide.amount_paid,
                    actual_fare:editRide.totalfare,
                    discount:editRide.discount
                }, function (response) {
                    if (typeof(response) == "string") {
                        response = JSON.parse(response);
                    }
                    if (response.status == 200) {
                        $scope.displaymsg = "Ride Modified Successfully.";
                    }
                    else if (response.status == 400) {
                        $scope.displaymsg = response['status'];
                    } else if (response.status == 404) {
                        $scope.displaymsg = "Something went wrong, please try again later.";
                    }
                    else{
                        $scope.displaymsg = response.message;
                    }
                    ngDialog.close({
                        template: 'edit_schedule_ride',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });

                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope
                    });
                })
            };

            //================================================================
            //                    remove filter
            //================================================================
            $scope.removeFilter = function(){
                $state.reload();
            }

            $scope.TimeOutError = function () {
                setTimeout(function () {
                    $scope.errorMsg = "";
                    $scope.$apply();
                }, 3000);

            }

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
