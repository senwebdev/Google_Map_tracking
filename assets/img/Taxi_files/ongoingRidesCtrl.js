/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.rides.ongoingRides')
        .controller('ongoingRidesCtrl', ongoingRidesCtrl);
    function ongoingRidesCtrl($timeout,$rootScope,$interval, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter) {
        'use strict';
        // $scope.showloader=true;
        // $scope.displaymsg = "";
        // /*if($cookieStore.get('type')==2){
        //     $scope.showcsvbtn = 0;
        // }
        // else
        // {
        //     $scope.showcsvbtn = 1;
        // }*/
        //
        // var dtInstance;
        //
        // var d = new Date((new Date()).getTime());
        // var offset = d.getTimezoneOffset();
        //
        // $("#ridescsv").attr("href", MY_CONSTANT.url + "/ongoing_rides?access_token=" + localStorage.getItem('access_token') + "&timezone=" + offset + "&csv=" + "1");
        //
        // //===============================================================
        // //                 DISPLAY TIME IN FORMAT
        // //================================================================
        // $scope.timeFormat = function(date){
        //     console.log(date);
        //     date = date.split(":")
        //     var hours = date[0];
        //     var minutes = date[1];
        //     var seconds = date[2];
        //     var ampm = hours >= 12 ? 'PM' : 'AM';
        //     hours = hours % 12;
        //     hours = hours ? hours : 12; // the hour '0' should be '12'
        //     hours = hours < 10 ? '0'+hours : hours;
        //     minutes = minutes < 10 ? '0'+minutes : minutes;
        //     seconds = seconds < 10 ? '0'+seconds : seconds;
        //     var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
        //     return strTime;
        // }
        //
        // $timeout(function () {
        //     if (!$.fn.dataTable) return;
        //     console.log(MY_CONSTANT.url + "/ongoing_rides?access_token=" + localStorage.getItem('access_token') + "&timezone=" + offset)
        //     dtInstance = $('#datatableOngoing').dataTable({
        //         'paging': true,  // Table pagination
        //         'ordering': true,  // Column ordering
        //         'info': true,  // Bottom left status text
        //         "order": [[ 0, "desc" ]],
        //         // Text translation options
        //         // Note the required keywords between underscores (e.g _MENU_)
        //         "bServerSide": true,
        //         sAjaxSource: MY_CONSTANT.url + "/ongoing_rides?access_token=" + localStorage.getItem('access_token') + "&timezone=" + offset,
        //         oLanguage: {
        //             sSearch: 'Search all columns:',
        //             sLengthMenu: '_MENU_ records per page',
        //             info: 'Showing page _PAGE_ of _PAGES_',
        //             zeroRecords: 'Nothing found - sorry',
        //             infoEmpty: 'No records available',
        //             infoFiltered: '(filtered from _MAX_ total records)'
        //         },
        //         "aoColumnDefs": [
        //             { 'bSortable': false, 'aTargets': [9] },
        //             {
        //                 render: function ( data, type, row ) {
        //                     var dateString = data.split(" ")
        //                     var timeString  = $scope.timeFormat(dateString[1]);
        //                     data = dateString[0]+" "+ timeString;
        //                     return data;
        //                 }, 'aTargets': [1]
        //             },
        //             {
        //                 render: function ( data, type, row ) {
        //                     if(data !='N/A'){
        //                         var dateString = data.split(" ")
        //                         var timeString  = $scope.timeFormat(dateString[1]);
        //                         data = dateString[0]+" "+ timeString;
        //                         console.log(data);
        //                         return data;
        //                     }
        //                     else{
        //                         return data;
        //                     }
        //                 }, 'aTargets': [5]
        //             }
        //
        //         ],
        //         "drawCallback": function() {
        //             var api = this.api();
        //             api.$('.completeride').click(function(e) {
        //                 $scope.completeRide(e);
        //             });
        //         }
        //     });
        //     $scope.showloader=false;
        //     var inputSearchClass = 'datatable_input_col_search';
        //     var columnInputs = $('tfoot .' + inputSearchClass);
        //
        //     // On input keyup trigger filtering
        //     columnInputs
        //         .keyup(function () {
        //             dtInstance.fnFilter(this.value, columnInputs.index(this));
        //         });
        //     $scope.$on('$destroy', function () {
        //         dtInstance.fnDestroy();
        //         $('[class*=ColVis]').remove();
        //     });
        // },10);
        // $interval( function () {
        //     var table = $('#datatableOngoing').dataTable();
        //     table.fnReloadAjax();
        // }, 15000 );
        // // When scope is destroyed we unload all DT instances
        // // Also ColVis requires special attention since it attaches
        // // elements to body and will not be removed after unload DT
        //
        // //});
        //
        // /*--------------------------------------------------------------------------
        //  * -------------------funtion to ask force stop Ongoing Ride ---------------
        //  --------------------------------------------------------------------------*/
        // $('#datatableOngoing').on('click', '.completeride', function(e) {
        //
        //     $scope.ongoing_ride_id= e.currentTarget.id;
        //
        //     ngDialog.open({
        //         template: 'force_stop_modalDialog',
        //         className: 'ngdialog-theme-default',
        //         showClose: false,
        //         scope: $scope
        //     });
        //
        //
        // });
        // $scope.completeRide = function(e) {
        //
        //     $scope.ongoing_ride_id= e.currentTarget.id;
        //
        //     ngDialog.open({
        //         template: 'force_stop_modalDialog',
        //         className: 'ngdialog-theme-default',
        //         showClose: false,
        //         scope: $scope
        //     });
        //
        //
        // };
        // $('#datatableOngoing').on('keypress', '.completeride', function(e) {
        //
        //     var code = e.keyCode || e.which;
        //     if( code === 13 ) {
        //         e.preventDefault();
        //         return false;
        //     }
        // });
        //
        // /*--------------------------------------------------------------------------
        //  * -------------------funtion to force stop Ongoing Ride -------------------
        //  --------------------------------------------------------------------------*/
        // $scope.force_stop = function () {
        //
        //     ngDialog.close({
        //         template: 'force_stop_modalDialog',
        //         className: 'ngdialog-theme-default',
        //         showClose: false,
        //         scope: $scope
        //     });
        //
        //     $.post(MY_CONSTANT.url_booking + '/force_complete_engagement', {
        //         access_token: localStorage.getItem('access_token'),
        //         engagement_id: $scope.ongoing_ride_id.toString()
        //     }, function (response) {
        //
        //         response = JSON.parse(response);
        //
        //         if (response.status== 200) {
        //             $scope.displaymsg = "Ride completed successfully.";
        //         }
        //         else if (response.status == 400) {
        //             $scope.displaymsg = response['status'];
        //         } else if (response.status == 404) {
        //             $scope.displaymsg = "Something went wrong, please try again later.";
        //         }
        //
        //         ngDialog.open({
        //             template: 'display_msg_modalDialog',
        //             className: 'ngdialog-theme-default',
        //             showClose: false,
        //             scope: $scope
        //         });
        //     });
        // };
        //
        // /*--------------------------------------------------------------------------
        //  * --------- funtion to refresh page ---------------------------------------
        //  --------------------------------------------------------------------------*/
        // $scope.refreshPage = function () {
        //     $state.reload();
        //     ngDialog.close({
        //         template: 'display_msg_modalDialog',
        //         className: 'ngdialog-theme-default',
        //         scope: $scope
        //     });
        //
        // };
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
        $scope.ongoingList=[];
        $scope.initTable = function(s) {
          $('#datatableOngoing').dataTable().fnDestroy();
          //
          var d={
                  access_token: localStorage.getItem('access_token'),
                  limit:10,
                  offset:$scope.skip
              };
          if(s!='sort'){
            d.sort_by=s;
          }
            $.post(MY_CONSTANT.url + '/ongoing_rides', d)
                .success(function (data, status) {
                    var arr = [];
                    var d = data;
                    console.log(d);
                    $rootScope.showloader=false;
                    $scope.ongoingList = d.paginated_rides;
                    $scope.totalItems = d.total_rides;
                    if($scope.totalItems==0)return false;
                    $scope.sortByItems=[];
                    var keys = $.map($scope.ongoingList[0], function(v, i){
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
                        dtInstance = $('#datatableOngoing').dataTable({
                            'searching': false,
                            'paging': true,  // Table pagination
                            'ordering': true,  // Column ordering
                            'info': true,
                            'scrollY': '500px',
                            'scrollX': '2000px',
                            "bDestroy": true,
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
                    },500);

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
        $scope.initTable();
    }
})();
