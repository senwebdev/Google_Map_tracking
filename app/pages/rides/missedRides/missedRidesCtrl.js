/* Copyrights-Developed by Taxi Technologies INC. */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.rides.missedRides')
        .controller('missedRidesCtrl', missedRidesCtrl);
    function missedRidesCtrl($timeout, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter) {

        $scope.showloader=true;
        $scope.displaymsg = "";

        $scope.is_driver = 0;
        $scope.is_customer = 0;
        $scope.start_date = "0/0/0";
        $scope.end_date = "0/0/0";
        $scope.is_apply_filter = 0;
        $scope.driver_name = "";
        $scope.customer_name = "";
        $scope.rides = {};
        var dtInstance;


        /*if($cookieStore.get('type')==2){
            $scope.showcsvbtn = 0;
        }
        else
        {
            $scope.showcsvbtn = 1;
        }
*/
        //type of USER
        $scope.select_user=[{
            id:0,
            name: 'Driver'
        },
            {
                id:1,
                name: 'Customer'
            }
        ];

        /*--------------------------------------------------------------------------
         -------------------------- datepicker code --------------------------------
         --------------------------------------------------------------------------*/

        $scope.showloader=true;
        /*if($cookieStore.get('type')==2){
            $scope.showcsvbtn = 0;
        }
        else
        {
            $scope.showcsvbtn = 1;
        }
*/
        $scope.minDate = new Date();
        $scope.maxDate = new Date();

        $scope.today = function() {
            $scope.rides.start_date = new Date();
        };

        $scope.clear = function () {
            $scope.rides.start_date = null;
        };


        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
            $scope.opened1=false;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.initDate = new Date();
        $scope.format = 'yyyy/MM/d';



        $scope.today = function() {
            $scope.ride.end_date = new Date();
        };
        //$scope.today();

        $scope.clear = function () {
            $scope.ride.end_date = null;
        };



        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open1 = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened1 = true;
            $scope.opened = false;

        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.initDate = new Date();
        $scope.format = 'yyyy/MM/d';


        /*--------------------------------------------------------------------------
         ------------------- end of datepicker code --------------------------------
         --------------------------------------------------------------------------*/






        var dtInstance;

        var d = new Date((new Date()).getTime());
        var offset = d.getTimezoneOffset();

        /*--------------------------------------------------------------------------
         ------------------- function to export data according to filters ----------
         --------------------------------------------------------------------------*/

        $("#ridescsv").click(function() {

            var start_date = $scope.rides.start_date;
            var end_date = $scope.rides.end_date;

            if(end_date)
                end_date.setDate(end_date.getDate() + 1);
            var days = end_date - start_date;

            if(($scope.rides.end_date != undefined) && ($scope.rides.start_date == '' || $scope.rides.start_date == undefined || $scope.rides.start_date == null)){
                $scope.errorMsg = "Please select start date";
                $scope.TimeOutError();
                return false;
            }
            if(($scope.rides.start_date != undefined) && ($scope.rides.end_date == '' || $scope.rides.end_date == undefined || $scope.rides.end_date == null)){
                $scope.errorMsg = "Please select End Date";
                $scope.TimeOutError();
                return false;
            }
            if (($scope.rides.end_date != undefined) && ($scope.rides.start_date != undefined) && days <= 0) {
                $scope.errorMsg = "Start Date must be less than End Date";
                $scope.TimeOutError();
                return false;
            }

            var start_date = $("#start_date").val();
            var end_date = $("#end_date").val();

            if (start_date && end_date) {

                var start_date1 = start_date + " 00:00:00";
                start_date1 = new Date(start_date1);
                start_date1 = start_date1.toUTCString();
                end_date = end_date + " 23:59:00";
                end_date = new Date(end_date);
                end_date = end_date.toUTCString();

                $("#ridescsv").attr("href", MY_CONSTANT.url + "/missed_rides?access_token=" + localStorage.getItem('access_token') + "&timezone=" + offset + "&csv=1" + "&driver_name=" + $scope.driver_name + "&customer_name=" + $scope.customer_name + "&is_apply_filter=1&start_date=" + start_date1 + "&end_date=" + end_date);
            }
            else {
                $("#ridescsv").attr("href", MY_CONSTANT.url + "/missed_rides?access_token=" + localStorage.getItem('access_token') + "&timezone=" + offset + "&csv=1");
            }

        });

        /*--------------------------------------------------------------------------
         ------------ end of function to export data according to filters ----------
         --------------------------------------------------------------------------*/
        //===============================================================
        //                 DISPLAY TIME IN FORMAT
        //================================================================
        $scope.timeFormat = function(date){
            console.log(date);
            date = date.split(":")
            var hours = date[0];
            var minutes = date[1];
            var seconds = date[2];
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            hours = hours < 10 ? '0'+hours : hours;
            minutes = minutes < 10 ? '0'+minutes : minutes;
            seconds = seconds < 10 ? '0'+seconds : seconds;
            var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
            return strTime;
        }

        //$("#ridescsv").attr("href", MY_CONSTANT.url + "/missed_rides?access_token=" + localStorage.getItem('access_token') + "&timezone=" + offset + "&csv=" + "1");

        $scope.loadData = function(){
            $timeout(function () {
            if ($.fn.DataTable.isDataTable("#datatableMissed")) {
                $('#datatableMissed').DataTable().clear().destroy();
            }
            if (!$.fn.dataTable) return;

        console.log("as");
        dtInstance = $('#datatableMissed').dataTable({

                'paging': true,  // Table pagination
                'ordering': true,  // Column ordering
                'info': true,  // Bottom left status text,
                "order": [[ 0, "desc" ]],
                // Text translation options
                // Note the required keywords between underscores (e.g _MENU_)
                "bServerSide": true,
                sAjaxSource: MY_CONSTANT.url + "/missed_rides?access_token=" + localStorage.getItem('access_token') +"&is_apply_filter=0&timezone=" + offset,
                oLanguage: {
                    sSearch: 'Search all columns:',
                    sLengthMenu: '_MENU_ records per page',
                    info: 'Showing page _PAGE_ of _PAGES_',
                    zeroRecords: 'Nothing found - sorry',
                    infoEmpty: 'No records available',
                    infoFiltered: '(filtered from _MAX_ total records)'
                },
                "aoColumnDefs": [
                    {
                        render: function ( data, type, row ) {
                            var dateString = data.split(" ")
                            var timeString  = $scope.timeFormat(dateString[1]);
                            data = dateString[0]+" "+ timeString;
                            console.log("a");
                            return data;
                        }, 'aTargets': [1]
                    },
                ]

            });
            $scope.showloader=false;


            var inputSearchClass = 'datatable_input_col_search';
            var columnInputs = $('tfoot .' + inputSearchClass);

            // On input keyup trigger filtering
            columnInputs
                .keyup(function () {
                    dtInstance.fnFilter(this.value, columnInputs.index(this));
                });

           /* var oTable = document.getElementById('datatableMissed');

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
        },10);
        };
$scope.showloader=false;
        // $scope.loadData();

        // When scope is destroyed we unload all DT instances
        // Also ColVis requires special attention since it attaches
        // elements to body and will not be removed after unload DT
        $scope.$on('$destroy', function () {
            dtInstance.fnDestroy();
            $('[class*=ColVis]').remove();
        });

        //===========================================================
        //                 APPLY FILTER FUNCTION
        //============================================================
        var d=new Date();
        console.log(moment(d).format('YYYY-MM-DD'));
        $('.applyBtn').click(function(){
            $scope.dateFilter();
        });
        $scope.dateFilter=function(){
            console.log($scope.dates.dates2);
            //$scope.$apply();
            console.log('as');
            // $scope.changeDate();
        };
        $scope.dates={};
        $scope.dates.dates2 = { startDate: moment('2016-08-01'), endDate: moment(d) };



        $scope.addfilter = function(){
            //$scope.is_apply_filter = 1;
            console.log($scope.dates.dates2);
            console.log(typeof $scope.dates.dates2);
            $scope.rides.start_date='';
            $scope.rides.end_date='';
            var start_date='';
            var end_date='';
            if(typeof $scope.dates.dates2=="string")
            {
                var r=$scope.dates.dates2.split(' - ');
                console.log(r);
                $scope.rides.start_date=r[0];
                $scope.rides.end_date=r[1];
                console.log($scope.rides.start_date);
                console.log($scope.rides.end_date);
                start_date = $scope.rides.start_date;
                end_date = $scope.rides.end_date;
                start_date = new Date(start_date);
                end_date = new Date(end_date);
                console.log(start_date);
                console.log(end_date);

            }
            else {
                $scope.rides.start_date=$scope.dates.dates2.startDate;
                $scope.rides.end_date=$scope.dates.dates2.endDate;
                console.log($scope.dates.dates2);
                start_date=$scope.rides.start_date;
                end_date=$scope.rides.end_date;
                console.log(start_date);
                console.log(end_date);
            }

            //if(end_date)
            //    end_date.setDate(end_date.getDate() + 1);
            //var days = end_date - start_date;
            //
            //if($scope.rides.start_date == '' || $scope.rides.start_date == undefined || $scope.rides.start_date == null){
            //    $scope.errorMsg = "Please select start date";
            //    $scope.TimeOutError();
            //    return false;
            //}
            //if($scope.rides.end_date == '' || $scope.rides.end_date == undefined || $scope.rides.end_date == null){
            //    $scope.errorMsg = "Please select End Date";
            //    $scope.TimeOutError();
            //    return false;
            //}
            //if (days <= 0) {
            //    $scope.errorMsg = "Start Date must be less than End Date";
            //    $scope.TimeOutError();
            //    return false;
            //}
            //
            //
            //var start_date = $("#start_date").val();
            //var end_date = $("#end_date").val();
            //start_date = start_date + " 00:00:00";
            //
            //var start_date = new Date(start_date);
            //start_date = start_date.toUTCString();
            //
            //
            //end_date = end_date + " 23:59:00";
            //end_date = new Date(end_date);
            //end_date = end_date.toUTCString();
            if($scope.rides.user==0){
                $scope.driver_name = $scope.rides.user_name;
                $scope.customer_name = "";
            }
            else if($scope.rides.user==1){
                $scope.driver_name = "";
                $scope.customer_name = $scope.rides.user_name;
            }


            if ($.fn.DataTable.isDataTable("#datatableMissed")) {
                $('#datatableMissed').DataTable().clear().destroy();
            }

            if (!$.fn.dataTable) return;
            dtInstance = $('#datatableMissed').dataTable({
                'paging': true,  // Table pagination
                'ordering': true,  // Column ordering
                'info': true,  // Bottom left status text
                "order": [[ 0, "desc" ]],
                // Text translation options
                // Note the required keywords between underscores (e.g _MENU_)
                "bServerSide": true,
                sAjaxSource: MY_CONSTANT.url + "/missed_rides?access_token=" + localStorage.getItem('access_token') +"&driver_name="+$scope.driver_name+ "&customer_name="+$scope.customer_name+"&is_apply_filter=1&start_date="+start_date+"&end_date="+end_date + "&timezone=" + offset,
                oLanguage: {
                    sSearch: 'Search all columns:',
                    sLengthMenu: '_MENU_ records per page',
                    info: 'Showing page _PAGE_ of _PAGES_',
                    zeroRecords: 'Nothing found - sorry',
                    infoEmpty: 'No records available',
                    infoFiltered: '(filtered from _MAX_ total records)'
                },
                "aoColumnDefs": [
                    {
                        render: function ( data, type, row ) {
                            var dateString = data.split(" ")
                            var timeString  = $scope.timeFormat(dateString[1]);
                            data = dateString[0]+" "+ timeString;
                            return data;
                        }, 'aTargets': [1]
                    },
                ]

            });
            var inputSearchClass = 'datatable_input_col_search';
            var columnInputs = $('tfoot .' + inputSearchClass);

            // On input keyup trigger filtering
            columnInputs
                .keyup(function () {
                    dtInstance.fnFilter(this.value, columnInputs.index(this));
                });

//             var oTable = document.getElementById('datatableMissed');
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
//                     /* get your cell info here */
//                     var cellVal = oCells.item(j).innerHTML;
//                 }
//             }



        }
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


    }
})();
