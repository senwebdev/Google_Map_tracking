/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.rides.scheduledRides')
        .controller('scheduledRidesCtrl', scheduledRidesCtrl);
    function scheduledRidesCtrl($timeout,$rootScope, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter) {

        $rootScope.showloader=false;

//         'use strict';
//         $scope.is_driver = 0;
//         $scope.is_customer = 0;
//         $scope.start_date = "0/0/0";
//         $scope.end_date = "0/0/0";
//         $scope.is_apply_filter = 0;
//         $scope.driver_name = "";
//         $scope.customer_name = "";
//         $scope.rides = "";
//         //type of USER
//         $scope.select_user=[{
//             id:0,
//             name: 'Driver'
//         },
//             {
//                 id:1,
//                 name: 'Customer'
//             }
//         ]
//
//         $scope.showloader = true;
//        /* if ($cookieStore.get('type') == 2) {
//             $scope.showcsvbtn = 0;
//         }
//         else {
//             $scope.showcsvbtn = 1;
//         }*/
//         $scope.minDate = new Date();
//         $scope.maxDate = new Date();
//
//         $scope.today = function() {
//             $scope.rides.start_date = new Date();
//         };
//
//         $scope.clear = function () {
//             $scope.rides.start_date = null;
//         };
//
//
//         $scope.toggleMin = function() {
//             $scope.minDate = $scope.minDate ? null : new Date();
//         };
//         $scope.toggleMin();
//
//         $scope.open = function($event) {
//             $event.preventDefault();
//             $event.stopPropagation();
//
//             $scope.opened = true;
//             $scope.opened1=false;
//         };
//
//         $scope.dateOptions = {
//             formatYear: 'yy',
//             startingDay: 1
//         };
//
//         $scope.initDate = new Date();
//         $scope.format = 'yyyy/MM/dd';
//
//
//
//         $scope.today = function() {
//             $scope.ride.end_date = new Date();
//         };
//         //$scope.today();
//
//         $scope.clear = function () {
//             $scope.ride.end_date = null;
//         };
//
//         //// Disable weekend selection
//         //$scope.disabled = function(date, mode) {
//         //    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
//         //};
//
//         $scope.toggleMin = function() {
//             $scope.minDate = $scope.minDate ? null : new Date();
//         };
//         $scope.toggleMin();
//
//         $scope.open1 = function($event) {
//             $event.preventDefault();
//             $event.stopPropagation();
//
//             $scope.opened1 = true;
//             $scope.opened = false;
//
//         };
//
//         $scope.dateOptions = {
//             formatYear: 'yy',
//             startingDay: 1
//         };
//
//         $scope.initDate = new Date();
//         $scope.format = 'yyyy/MM/dd';
//
//         //datepicker
//         var start = new Date();
//         start.setHours(start.getHours() + 1);
//         start = new Date(start);
//
//         start.setMinutes(start.getMinutes() + 4);
//         start = new Date(start);
//
//         //e.setDate(start.getDate() + 3);
//
//
//         var dtInstance;
//         var d = new Date((new Date()).getTime());
//         var offset = d.getTimezoneOffset();
//         $("#ridescsv").attr("href", MY_CONSTANT.url + "/scheduled_rides?access_token=" + localStorage.getItem('access_token') + "&timezone=" + offset + "&csv=" + "1");
//         //===============================================================
//         //                 DISPLAY TIME IN FORMAT
//         //================================================================
//         $scope.timeFormat = function(date){
//             //console.log(date);
//             date = date.split(":")
//             var hours = date[0];
//             var minutes = date[1];
//             var seconds = date[2];
//             var ampm = hours >= 12 ? 'PM' : 'AM';
//             hours = hours % 12;
//             hours = hours ? hours : 12; // the hour '0' should be '12'
//             hours = hours < 10 ? '0'+hours : hours;
//             minutes = minutes < 10 ? '0'+minutes : minutes;
//             seconds = seconds < 10 ? '0'+seconds : seconds;
//             var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
//             return strTime;
//         }
//
//         $scope.loadData = function() {
//             $timeout(function(){
//               console.log("sd");
//             if ($.fn.DataTable.isDataTable("#datatableScheduled")) {
//                 $('#datatableScheduled').DataTable().clear().destroy();
//             }
//             if (!$.fn.dataTable) return;
//             dtInstance = $('#datatableScheduled').dataTable({
//                 'paging': true,  // Table pagination
//                 'ordering': true,  // Column ordering
//                 'info': true,  // Bottom left status text,
//                 "order": [[ 0, "desc" ]],
//                 // Text translation options
//                 // Note the required keywords between underscores (e.g _MENU_)
//                 "bServerSide": true,
//                 sAjaxSource: MY_CONSTANT.url + "/scheduled_rides?access_token=" + localStorage.getItem('access_token') + "&timezone=" + offset,
//                 oLanguage: {
//                     sSearch: 'Search all columns:',
//                     sLengthMenu: '_MENU_ records per page',
//                     info: 'Showing page _PAGE_ of _PAGES_',
//                     zeroRecords: 'Nothing found - sorry',
//                     infoEmpty: 'No records available',
//                     infoFiltered: '(filtered from _MAX_ total records)'
//                 },
//                 "aoColumnDefs": [
//                     {'bSortable': false, 'aTargets': [9,10]},
//                     {
//                         render: function ( data, type, row ) {
//                             var dateString = data.split(" ")
//                             var timeString  = $scope.timeFormat(dateString[1]);
//                             data = dateString[0]+" "+ timeString;
//                             return data;
//                         }, 'aTargets': [1]
//                     },
//                     {
//                         render: function ( data, type, row ) {
//                             var dateString = data.split(" ")
//                             var timeString  = $scope.timeFormat(dateString[1]);
//                             data = dateString[0]+" "+ timeString;
//                             return data;
//                         }, 'aTargets': [4]
//                     },{
//                         render: function ( data, type, row ) {
//                             //console.log(data);
//                             var inp=data.split('class="');
//                             var s=inp[0]+'ng-mousedown="cancelRide();" class="cancelRide '+inp[1];
//                             data=s;
//                             //console.log(s);
//                             return data;
//                         }, 'aTargets': [10]
//                     }
//                 ],
//                 "drawCallback": function() {
//                     var api = this.api();
//                     api.$('.cancelRide').click(function(e) {
//                         $scope.cancelRide(e);
//                     });
//                     api.$('.editScheduleRide').click(function(e) {
//                         $scope.editRide(e);
//                     });
//                 }
//             });
//             $scope.showloader = false;
//             var inputSearchClass = 'datatable_input_col_search';
//             var columnInputs = $('tfoot .' + inputSearchClass);
//
//             // On input keyup trigger filtering
//             columnInputs
//                 .keyup(function () {
//                     dtInstance.fnFilter(this.value, columnInputs.index(this));
//                 });
//              $('.completeride').addClass('cancelRide');
//                 $scope.$on('$destroy', function () {
//                     dtInstance.fnDestroy();
//                     $('[class*=ColVis]').remove();
//                 });
//             },10);
//
//
//         // When scope is destroyed we unload all DT instances
//         // Also ColVis requires special attention since it attaches
//         // elements to body and will not be removed after unload DT
//
//
//         };
//         $scope.loadData();
//         $scope.$on('$destroy', function () {
//             dtInstance.fnDestroy();
//             $('[class*=ColVis]').remove();
//         });
//         /*--------------------------------------------------------------------------
//          * -------------------funtion to ask cancel Schedule Rides ---------------
//          --------------------------------------------------------------------------*/
//         $('#datatableScheduled').on('click', '.cancelRide', function (e) {
//             console.log("asd");
//             e.preventDefault();
//             $scope.scheduled_ride_id = e.currentTarget.id;
//             console.log("asas");
//             ngDialog.open({
//                 template: 'cancel_ride_modalDialog',
//                 className: 'ngdialog-theme-default',
//                 showClose: false,
//                 scope: $scope
//             });
//
//
//         });
//
//         $('.cancelRide').click(function(e){
//             $scope.scheduled_ride_id = e.currentTarget.id;
//             console.log("asas");
//             ngDialog.open({
//                 template: 'cancel_ride_modalDialog',
//                 className: 'ngdialog-theme-default',
//                 showClose: false,
//                 scope: $scope
//             });
//
//
//         });
//         $scope.cancelRide= function(e){
//             $scope.scheduled_ride_id = e.currentTarget.id;
//             console.log("asas");
//             ngDialog.open({
//                 template: 'cancel_ride_modalDialog',
//                 className: 'ngdialog-theme-default',
//                 showClose: false,
//                 scope: $scope
//             });
//         };
//
//         $('#datatableScheduled').on('keypress', '.cancelRide', function (e) {
//
//             var code = e.keyCode || e.which;
//             if (code === 13) {
//                 e.preventDefault();
//                 return false;
//             }
//         });
//
//
//         /*--------------------------------------------------------------------------
//          * -------------------funtion to cancel Schedule Ride -------------------
//          --------------------------------------------------------------------------*/
//         $scope.cancel_schedule_ride = function () {
//
//             ngDialog.close({
//                 template: 'cancel_ride_modalDialog',
//                 className: 'ngdialog-theme-default',
//                 showClose: false,
//                 scope: $scope
//             });
//
//             $.post(MY_CONSTANT.url + '/remove_schedule_ride', {
//                 access_token: localStorage.getItem('access_token'),
//                 pickup_id: $scope.scheduled_ride_id.toString()
//             }, function (response) {
//
//                 //response = JSON.parse(response);
//
//                 if (response.status == 200) {
//                     $scope.displaymsg = "Ride Cancelled Successfully.";
//                 }
//                 else if (response.status == 404) {
//                     $scope.displaymsg = response['status'];
//                 } else if (response.status == 500) {
//                     $scope.displaymsg = "Something went wrong, please try again later.";
//                 }
//
//                 ngDialog.open({
//                     template: 'display_msg_modalDialog',
//                     className: 'ngdialog-theme-default',
//                     showClose: false,
//                     scope: $scope
//                 });
//             });
//         };
//
//
//         /*--------------------------------------------------------------------------
//          * -------------------funtion to modify Scheduled Rides ---------------
//          --------------------------------------------------------------------------*/
//         $('#datatableScheduled').on('click', '.editScheduleRide', function (e) {
//             $scope.scheduled_ride_id = e.currentTarget.id;
//
//             ngDialog.open({
//                 template: 'editschedule_ride_confirm',
//                 className: 'ngdialog-theme-default',
//                 showClose: false,
//                 scope: $scope
//             });
//
//
//         });
//         $scope.editRide = function (){
//             $scope.scheduled_ride_id = e.currentTarget.id;
//
//             ngDialog.open({
//                 template: 'editschedule_ride_confirm',
//                 className: 'ngdialog-theme-default',
//                 showClose: false,
//                 scope: $scope
//             });
//         }
//         $('#datatableScheduled').on('keypress', '.editScheduleRide', function (e) {
//
//             var code = e.keyCode || e.which;
//             if (code === 13) {
//                 e.preventDefault();
//                 return false;
//             }
//         });
//
//
//         /*--------------------------------------------------------------------------
//          * -------------------funtion to edit  Schedule Ride -------------------
//          --------------------------------------------------------------------------*/
//         $scope.editScheduleRide = function () {
//
//             ngDialog.close({
//                 template: 'editschedule_ride_confirm',
//                 className: 'ngdialog-theme-default',
//                 showClose: false,
//                 scope: $scope
//             });
//             $.post(MY_CONSTANT.url + '/get_schedule_ride', {
//                 access_token: localStorage.getItem('access_token'),
//                 pickup_id: $scope.scheduled_ride_id.toString()
//             }, function (response) {
//                 if (typeof(response) == "string") {
//                     response = JSON.parse(response);
//                 }
//                 if (response.status == 200) {
//                     $scope.editSchedule = {
//                         pickupAddress: response.data.address,
//                         dropoffAddress: response.data.manual_destination_address,
//                         pickuptime: moment(response.data.pickup_time).format("YYYY/MM/DD HH:mm"),
//                         further_info:response.data.further_info,
//                         pickup_id: response.data.pickup_id,
//                         user_id:response.data.user_id
//                     }
//
//                     ngDialog.open({
//                         templateUrl: 'edit_schedule_ride',
//                         className: 'ngdialog-theme-default',
//                         showClose: false,
//                         scope: $scope
//                     });
//
//                     $scope.$on('ngDialog.opened', function (e, element) {
//                         $("#pick_up_time").datetimepicker({
//                             format: 'yyyy/mm/dd hh:ii',
//
//                             autoclose: true,
//                             startDate: start
//                             //endDate: e
//                         });
//                     });
//                 }
//                 else {
//                     $scope.displaymsg = response.message;
//                     ngDialog.open({
//                         template: 'display_msg_modalDialog',
//                         className: 'ngdialog-theme-default',
//                         showClose: false,
//                         scope: $scope
//                     });
//                 }
//
//
//             });
//             /*--------------------------------------------------------------------------
//              * ---------------funtion to submit modified  Schedule Ride ----------------
//              --------------------------------------------------------------------------*/
//             $scope.geocode = function (address, flag, callback) {
//                 (new google.maps.Geocoder()).geocode({
//                     'address': address
//                 }, function (results, status) {
//                     if (status == google.maps.GeocoderStatus.OK) {
//                         if (flag == 0) {
//                             $scope.editSchedule.latitude = results[0].geometry.location.lat();
//                             $scope.editSchedule.longitude = results[0].geometry.location.lng();
//                         }
//                         else if (flag == 1) {
//                             $scope.editSchedule.manual_destination_address = address;
//                             $scope.editSchedule.manual_destination_latitude = results[0].geometry.location.lat();
//                             $scope.editSchedule.manual_destination_longitude = results[0].geometry.location.lng();
//                         }
//
//                         callback(true);
//                     }
//                 });
//             };
//
//             $scope.submitEditSchedule = function (editSchedule) {
//                 $scope.geocode(editSchedule.pickupAddress, 0, function (success) {
//                     if (editSchedule.dropoffAddress) {
//                         $scope.geocode(editSchedule.dropoffAddress, 1, function (success) {
//                             abc(editSchedule);
//                         });
//                     }
//                     else {
//                         abc(editSchedule);
//                     }
//                 });
//
//             };
//
//             function abc(editSchedule) {
//                 $scope.editSchedule.pickup_time = editSchedule.pickuptime;
//                 // $scope.editSchedule.pickup_time = new Date(editSchedule.pickuptime);
//                 // $scope.editSchedule.pickup_time = $scope.editSchedule.pickup_time.toUTCString();
//                 if($scope.editSchedule.further_info){
//                     $scope.editSchedule.further_info = editSchedule.further_info;
//                 }
//                 else{
//                     $scope.editSchedule.further_info = "";
//                 }
//                 $scope.editSchedule.access_token =localStorage.getItem('access_token');
//                 $scope.editSchedule.admin_panel_request_flag =  1
//                 $.post(MY_CONSTANT.url_booking + '/modify_pickup_schedule', $scope.editSchedule).then(
//                     function (response) {
//                         if (typeof(response) == "string") {
//                             response = JSON.parse(response);
//                         }
//                         if (response.status == 200) {
//                             $scope.displaymsg = "Schedule Ride Modified Successfully.";
//                         }
//                         else if (response.status == 404) {
//                             $scope.displaymsg = response['status'];
//                         } else if (response.status == 500) {
//                             $scope.displaymsg = "Something went wrong, please try again later.";
//                         }
//                         else{
//                             $scope.displaymsg = response.message;
//                         }
//                         ngDialog.close({
//                             template: 'edit_schedule_ride',
//                             className: 'ngdialog-theme-default',
//                             showClose: false,
//                             scope: $scope
//                         });
//
//                         ngDialog.open({
//                             template: 'display_msg_modalDialog',
//                             className: 'ngdialog-theme-default',
//                             showClose: false,
//                             scope: $scope
//                         });
//                     });
//             };
//
//         }
//
//         //===========================================================
//         //                 APPLY FILTER FUNCTION
//         //============================================================
//         $scope.addfilter = function(){
//             //$scope.is_apply_filter = 1;
//             var start_date = $scope.rides.start_date;
//             var end_date = $scope.rides.end_date;
//             start_date = new Date(start_date);
//             end_date = new Date(end_date);
//
//             if(end_date)
//                 end_date.setDate(end_date.getDate() + 1);
//             var days = end_date - start_date;
//
//             if($scope.rides.start_date == '' || $scope.rides.start_date == undefined || $scope.rides.start_date == null){
//                 $scope.errorMsg = "Please select start date";
//                 $scope.TimeOutError();
//                 return false;
//             }
//             if($scope.rides.end_date == '' || $scope.rides.end_date == undefined || $scope.rides.end_date == null){
//                 $scope.errorMsg = "Please select End Date";
//                 $scope.TimeOutError();
//                 return false;
//             }
//             if (days <= 0) {
//                 $scope.errorMsg = "Start Date must be less than End Date";
//                 $scope.TimeOutError();
//                 return false;
//             }
//
//
//             var start_date = $("#start_date").val();
//             var end_date = $("#end_date").val();
//             start_date = start_date + " 00:00:00";
//             var start_date = new Date(start_date);
//             start_date = start_date.toUTCString();
//
//
//             end_date = end_date + " 23:59:00";
//             end_date = new Date(end_date);
//             end_date = end_date.toUTCString();
//
//             if(!angular.isUndefined($scope.rides.user_name)){
//                 $scope.driver_name = "";
//                 $scope.customer_name = $scope.rides.user_name;
//             }
//             else{
//                 $scope.driver_name = "";      //in case of nothing is selected
//                 $scope.customer_name = "";
//             }
//
//
//             if ($.fn.DataTable.isDataTable("#datatableScheduled")) {
//                 $('#datatableScheduled').DataTable().clear().destroy();
//             }
//
//
//
//
//             if (!$.fn.dataTable) return;
//             dtInstance = $('#datatableScheduled').dataTable({
//                 'paging': true,  // Table pagination
//                 'ordering': true,  // Column ordering
//                 'info': true,  // Bottom left status text
//                 // Text translation options
//                 // Note the required keywords between underscores (e.g _MENU_)
//                 "bServerSide": true,
//                 sAjaxSource: MY_CONSTANT.url + "/scheduled_rides?access_token=" + localStorage.getItem('access_token') +"&driver_name="+$scope.driver_name+ "&customer_name="+$scope.customer_name+"&is_apply_filter=1&start_date="+start_date+"&end_date="+end_date + "&timezone=" + offset,
//                 oLanguage: {
//                     sSearch: 'Search all columns:',
//                     sLengthMenu: '_MENU_ records per page',
//                     info: 'Showing page _PAGE_ of _PAGES_',
//                     zeroRecords: 'Nothing found - sorry',
//                     infoEmpty: 'No records available',
//                     infoFiltered: '(filtered from _MAX_ total records)'
//                 }
//
//             });
//             var inputSearchClass = 'datatable_input_col_search';
//             var columnInputs = $('tfoot .' + inputSearchClass);
//
//             // On input keyup trigger filtering
//             columnInputs
//                 .keyup(function () {
//                     dtInstance.fnFilter(this.value, columnInputs.index(this));
//                 });
//
//            /* var oTable = document.getElementById('datatableScheduled');
//
// //gets rows of table
//             var rowLength = oTable.rows.length;
//
// //loops through rows
//             for (var i = 0; i < rowLength-1; i++){
//
//                 //gets cells of current row
//                 var oCells = oTable.rows.item(i).cells;
//
//                 //gets amount of cells of current row
//                 var cellLength = oCells.length;
//
//                 //loops through each cell in current row
//                 for(var j = 0; j < cellLength; j++){
//                     /!* get your cell info here *!/
//                     var cellVal = oCells.item(j).innerHTML;
//                 }
//             }*/
//
//
//
//         }
//         //================================================================
//         //                    remove filter
//         //================================================================
//         $scope.removeFilter = function(){
//             $state.reload();
//         }
//         $scope.TimeOutError = function () {
//             setTimeout(function () {
//                 $scope.errorMsg = "";
//                 $scope.$apply();
//             }, 3000);
//
//         }
//         $scope.refreshPage = function () {
//             $state.reload();
//             ngDialog.close({
//                 template: 'display_msg_modalDialog',
//                 className: 'ngdialog-theme-default',
//                 scope: $scope
//             });
//
//         };
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
    $('#datatableScheduled').dataTable().fnDestroy();
    //
    var d={
            access_token: localStorage.getItem('access_token'),
            limit:10,
            offset:$scope.skip
        };
    if(s!='sort'){
      d.sort_by=s;
    }
    $.post(MY_CONSTANT.url + '/scheduled_rides', d)
        .success(function (data, status) {
            var arr = [];
            var d = JSON.parse(data);
            console.log(d);
            $rootScope.showloader=false;
            $scope.scheduledList = d.paginated_schedules;
            $scope.totalItems= d.total_schedules;
            if($scope.totalItems==0)return false;
            $scope.sortByItems=[];
            var keys = $.map($scope.scheduledList[0], function(v, i){
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
              $rootScope.showloader=false;
            // var dtInstance;
            $timeout(function () {
                if (!$.fn.dataTable) return;
                dtInstance = $('#datatableScheduled').dataTable({
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
    }
})();
