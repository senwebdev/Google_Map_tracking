/* Copyrights-Developed by Taxi Technologies INC. */

(function () {
    'use strict';

    angular.module('BlurAdmin.pages.reports')
        .controller('reportsCtrl', reportsCtrl);
    function reportsCtrl($timeout, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter) {
        $scope.reports = {};



        /*----------------- draw charts for last week -------------------------------*/
        var now = new Date();
        var startTime = now.setDate(now.getDate() - 7);
        $scope.offset = now.getTimezoneOffset();
        drawCharts(now.toISOString(),new Date().toISOString());


        /*--------------------------------------------------------------------------
         * ---------------- funtion to draw charts ---------------------------------
         --------------------------------------------------------------------------*/
        var d=new Date();
        console.log(moment(d).format('YYYY-MM-DD'));
        $('.applyBtn').click(function(){
            $scope.dateFilter();
        });
        $scope.dateFilter=function(){
            console.log($scope.dates.dates2);
            //$scope.$apply();f
            console.log('as');
            // $scope.changeDate();
        };
        $scope.dates={};
        $scope.dates.dates2 = { startDate: moment('2016-08-01'), endDate: moment(d) };

        $scope.filteredChart = function () {
            console.log($scope.dates.dates2);
            console.log(typeof $scope.dates.dates2);
            $scope.rides={};
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

            drawCharts(start_date,end_date);
        };
        $scope.findCharts = function () {

            var start_date = $scope.reports.start_date1;
            var end_date = $scope.reports.end_date1;

            if(end_date)
                end_date.setDate(end_date.getDate() + 1);

            var days = end_date - start_date;

            if($scope.reports.start_date1 == '' || $scope.reports.start_date1 == undefined || $scope.reports.start_date1 == null){

                $scope.displaymsg = "Please select start date.";

                ngDialog.open({
                    template: 'display_msg_modalDialog',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope
                });
            }
            else if($scope.reports.end_date1 == '' || $scope.reports.end_date1 == undefined || $scope.reports.end_date1 == null){
                $scope.displaymsg = "Please select end date.";

                ngDialog.open({
                    template: 'display_msg_modalDialog',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope
                });
            }
            else if (days <= 0) {
                $scope.displaymsg = "Start date must be less than end date";
                ngDialog.open({
                    template: 'display_msg_modalDialog',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope
                });
            }
            else{
                start_date = $("#start_date").val();
                end_date = $("#end_date").val();

                start_date = startDateToUTC(start_date);
                end_date = endDateToUTC(end_date);

                drawCharts(start_date,end_date);

            }

        }

        /*--------------------------------------------------------------------------
         * ---------------- code for datepicker ------------------------------------
         --------------------------------------------------------------------------*/

        $scope.maxDate = new Date();

        $scope.today = function() {
            $scope.promo.start_date = new Date();
        };
        //$scope.today();

        $scope.clear = function () {
            $scope.promo.start_date = null;
        };

        $scope.toggleMin = function() {
            $scope.maxDate = $scope.maxDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.initDate = new Date();
        $scope.format = 'yyyy-MM-dd';



        $scope.today = function() {
            $scope.promo.end_date = new Date();
        };
        //$scope.today();

        $scope.clear = function () {
            $scope.promo.end_date = null;
        };

        $scope.toggleMin = function() {
            $scope.maxDate = $scope.maxDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open1 = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened1 = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.initDate = new Date();
        $scope.format = 'yyyy-MM-dd';

        /*--------------------------------------------------------------------------
         * ---------------- function to draw charts --------------------------------
         --------------------------------------------------------------------------*/
        function drawCharts(start_date,end_date){

            /*----------------- API Heat for earning chart ---------------------------*/
            $http.post(MY_CONSTANT.url + '/heat_map_earnings', {
                access_token: localStorage.getItem('access_token'),
                start_time: start_date,
                end_time: end_date,
                timezone: $scope.offset.toString()
            }).success(function (response) {
                var data = response;
                var chart = new Highcharts.Chart(data);
                //$scope.$apply();
            });


            /*----------------- API Heat for ride chart ------------------------------*/
            $http.post(MY_CONSTANT.url + '/heat_map_rides_data', {
                access_token: localStorage.getItem('access_token'),
                start_time: start_date,
                end_time: end_date,
                timezone: $scope.offset.toString()
            }).success(function (response) {
                var data = response;
                var chart = new Highcharts.Chart(data);
               // $scope.$apply();
            });
        }

    }
})();