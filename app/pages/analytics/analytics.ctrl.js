(function () {
    'use strict';
    angular.module('BlurAdmin.pages.analytics')
    .controller('analyticsCtrl', analyticsCtrl);

    function analyticsCtrl($timeout, $rootScope, $scope, $http, MY_CONSTANT, ngDialog ,$state, $filter, $mdSidenav, $log) {
        $timeout( function(){
            Highcharts.chart('container0', {
                chart: {
                    type: 'line'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Burn Per Ride'
                },
                xAxis: {
                    type: 'datetime',
                    labels: {
                      format: '{value:%Y-%b-%e}'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Burn Amount'
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    name: 'Driver Burn',
                    data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: 'Customer Burn',
                    data: [3.9, 4.2, -5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                },
                {
                    name: 'Total Burn',
                    data: [10.0, 12.9, 19.5, 19.5, 20.4, 21.5, 25.2, 42.5, 37.3, 28.3, 23.9, 19.6]
                }]
            });
            Highcharts.chart('container1', {
                chart: {
                    type: 'line'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Transaction'
                },
                xAxis: {
                    type: 'datetime',
                    labels: {
                      format: '{value:%Y-%b-%e}'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Amount'
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    name: 'Completed',
                    data: [1.0, 1.5, 2.5, 3.5, 6.4, 3.5, 2.2, 0.5, 0, 0, 1, 6]
                }, {
                    name: 'Paid',
                    data: [1.9, 2.2, 3.7, 4.5, 5.9, 6.2, 7.0,8.6, 9.2, 10.3,11.6,12.8]
                },
                {
                    name: 'First Time',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                },
                {
                    name: 'Recurring',
                    data: [0.9, 3.2, 1.7, 2.5, 1.9, 6.2, 3.0, 2.6, 6.2, 10.3, 5.6, 1.8]
                }
            ]
            });
            Highcharts.chart('container2', {
                chart: {
                    type: 'line'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Demand Quality'
                },
                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                yAxis: {
                    title: {
                        text: 'Number'
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    name: 'Ride Request',
                    data: [1.0, 2.9, 3.5, 4.5, 5.4, 6.5, 7.2, 8.5, 9.3, 10.3, 11.9, 12.6]
                }, {
                    name: 'Rides Accepted',
                    data: [11.9, 12.2, 13.7, 14.5, 15.9, 16.2, 17.0, 18.6, 19.2, 20.3, 21.6, 22.8]
                },
                {
                    name: 'Rides Completed',
                    data: [13.9, 14.2, 15.7, 18.5, 1.9, 15.2, 1.0, 13.6, 16.2, 10.3, 16.6, 14.8]
                },
                {
                    name: 'User Cancelled Rides',
                    data: [23.9, 14.2, 45.7, 18.5, 11.9, 15.2, 17.0, 16.6, 14.2, 30.3, 26.6, 14.8]
                },
                {
                    name: 'User cancelled Requests',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                },
                {
                    name: 'Driver Cancelled Rides',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                },
                {
                    name: 'Rides Missed',
                    data: [10.9, 20.2,36.7, 13.5, 21.9, 12.2, 17.0, 31.6, 14.2, 30.3, 6.6, 4.8]
                },
                {
                    name: 'Driver Cancelled Request',
                    data: [33.9, 34.2, 25.7, 28.5, 11.9, 10.2, 9.0, 20.6, 21.2, 10.3, 6.6, 4.8]
                }
            ]
            });
             Highcharts.chart('container3', {
                chart: {
                    type: 'column'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Registration Analytics'
                },
                tooltip: {
                    formatter: function() {
                        var date = new Date(this.x);
                        var year = date.getFullYear();
                        return '<span style="color:'+this.series.color+'">'+ this.series.name +'</span>: '+ this.y ;
                     },
                },

                xAxis: {
                    type: 'datetime',
                    labels: {
                      format: '{value:%Y-%b-%e}'
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Amount'
                    }
                },
               
               
                series: [{
                    name: 'Total Downloads',
                    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            
                }, {
                    name: 'User Referrals',
                    data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
            
                }, {
                    name: 'Driver Referrals',
                    data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
            
                }, {
                    name: 'Others',
                    data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
            
                }
            ,
            {
                name: 'Promo error',
                data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
        
            }]
            });
            Highcharts.chart('container4', {
                chart: {
                    type: 'line'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'User App Analytics'
                },
                
                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                yAxis: {
                    title: {
                        text: 'Temperature (°C)'
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    name: 'App uninstalls.',
                    data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: 'App opens',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                }]
            });
            Highcharts.chart('container14', {
                chart: {
                    type: 'line'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Driver App Analytics'
                },
                
                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                yAxis: {
                    title: {
                        text: 'Temperature (°C)'
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    name: 'App uninstalls.',
                    data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: 'App opens',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                }]
            });
            Highcharts.chart('container5', {
                chart: {
                    type: 'column'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Debt Analytics'
                },
               xAxis: {
                    type: 'datetime',
                    labels: {
                      format: '{value:%Y-%b-%e}'
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Amount'
                    }
                },
               
                series: [{
                    name: 'Cumulative Debt',
                    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            
                }, {
                    name: 'Day-Wise Debt',
                    data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
            
                }, ]
            });
            Highcharts.chart('container6', {
                chart: {
                    type: 'column'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'User Churn Monthy'
                },
                
                xAxis: {
                    categories: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec'
                    ],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Number'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: 'Users added',
                    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            
                }, {
                    name: 'Users churned',
                    data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
            
                }, {
                    name: 'Retained users',
                    data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
            
                }, {
                    name: 'Baseline ',
                    data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
            
                }]
            });
            Highcharts.chart('container7', {
                chart: {
                    type: 'column'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Driver Churn Monthly'
                },
               
                xAxis: {
                    categories: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec'
                    ],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Number'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: 'Rides added',
                    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            
                }, {
                    name: 'Rides churned',
                    data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
            
                }, {
                    name: 'Retained rides',
                    data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
            
                }, {
                    name: 'Baseline',
                    data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
            
                }]
            });
            Highcharts.chart('container8', {
                chart: {
                    type: 'column'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Dormant user behaviour'
                },
             
                xAxis: {
                    type: 'datetime',
                    labels: {
                      format: '{value:%Y-%b-%e}'
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Number'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: 'Dormant >=3 & 7 days',
                    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            
                }, {
                    name: 'Dormant >=7 & <30 days',
                    data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
            
                }, {
                    name: 'Dormant >= 30 days',
                    data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
            
                }, ]
            });
            Highcharts.chart('container9', {
                chart: {
                    type: 'bar'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Total Supply Hours'
                },
                
                xAxis: {
                    // categories: [']
                   
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Number',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    valueSuffix: ' '
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 80,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Active',
                    data: [107, 31, 635,]
                }, {
                    name: 'Total',
                    data: [133, 156, 947,]
                }, 
                {
                    name: 'Per Driver Hours',
                    data: [1052, 954, 4250,]
                }
            ]
            });
        }, 1000 );
        
    
    } 
})();