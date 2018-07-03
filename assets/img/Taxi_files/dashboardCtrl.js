/**
 * Created by web on 17/05/17.
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
    .controller('dashboardCtrl', dashboardCtrl)
    // .service('dashboardService', dashboardService)
    // ;
    function dashboardCtrl($timeout,$rootScope, $scope, $http, MY_CONSTANT,ngDialog,$state,$filter, socketFactory, toastr)
    {

       $rootScope.showloader = false;
        $scope.expand = 1;
        $scope.showim=0;
        $scope.check=function(id)
        {
            console.log(id);
            var ids = 'object-'+id;
            console.log(ids);
          $scope.showim=!$scope.showim;
          console.log($scope.showim);
          if($scope.showim=='0')
          {
              console.log("Working");
              $scope.collapseDisc();

          }
             }
            //  $('#'+ids).toggleClass('rotate-180');


        $scope.expandDisc = function (daa,id) {
           console.log(daa,id);
            $('#mapCustom').css("margin-left","18%");
            $('#mapCustom').addClass('col-lg-12');
            $('#expandedDiv').css("transform","translate(92.5%)");
            $('#expandedDiv').css("transition","1s");
            $('#expandedDiv').css("left","3%");
            // $('#mapCustom').removeClass('col-lg-12');
            var ids = 'object-'+id;
            $('#'+ids).toggleClass('rotate-180');

//Trip_Detail
$scope.pickup_location_address=daa.pickup_location_address;
$scope.manual_destination_address=daa.manual_destination_address;
$scope.driver_name=daa.driver_name;
$scope.car_name=daa.car_name;
$scope.driver_mobile=daa.driver_mobile;
$scope.fare_calculated="$"+daa.fare_calculated;
if(daa.hasOwnProperty("fare_calculated"));
{
$scope.fare_calculated="$"+daa.fare_calculated;
}
if(daa.hasOwnProperty("daa.fare_calculated")==false);
{
    $scope.fare_calculated="Unavailable";
}


if(daa.hasOwnProperty("session_id"));
{
$scope.tripnumber="Trip Number: #"+daa.session_id;
}
if(daa.hasOwnProperty("session_id")==false);
{
    $scope.tripnumber="Trip Number:Unavailable";
}
//Customer
$scope.user_name=daa.user_name;
$scope.user_id=daa.user_id;
$scope.user_rating=daa.user_rating;
$scope.user_mobile=daa.user_mobile;
$scope.user_email=daa.user_email;
$scope.user_image=daa.user_image;

//History



        }
        $scope.collapseDisc = function () {
            $scope.expand = 1;
            $('#mapCustom').css("margin-left","18%");
            $('#mapCustom').addClass('col-lg-12');
            $('#expandedDiv').css("transform","translate(-200%)");
            $('#expandedDiv').css("transition","1s");
            // $('#mapCustom').removeClass('col-lg-6');


        }
        $('.parent').addClass('activeNew');
        $('.scheduled').removeClass('activeNew');
        $('.completed').removeClass('activeNew');
        $('.tripDetailsClick').addClass('activesTwo');
        $('.customerClick').removeClass('activesTwo');
        $('.historyOfCustomerClick').removeClass('activesTwo');
        $scope.onGoing = 1;
        $scope.skip = 0;
        $scope.scheduled = 0;
        $scope.completed = 0;
        $scope.tripDetailsC = 1;
        $scope.customersC = 0;
        $scope.historyC = 0;




/*--- Right Side Detail Panel STARTS--*/

$scope.expand1 = 1;
$scope.expanded = function (daa)
        {
            console.log(daa);
            $scope.expand1 = 0;
            $('#expandedRDiv').css("transform","translate(-74.5%)");
            $('#expandedRDiv').css("transition","1s");
            $('#expandedRDiv').css("right","2.5%");
            $scope.driver_image=daa.driver_image;
            $scope.driver_mobile=daa.driver_mobile;
            $scope.driver_email=daa.driver_email;
            $scope.device_name=daa.device_name;
            $scope.car_name=daa.car_name;
            $scope.car_no=daa.car_no;
        }

 $scope.collapseDiscR = function () {
            console.log("Working");
            $scope.expand = 1;
            // $('#mapCustom').css("margin-left","20%");
            // $('#mapCustom').addClass('col-lg-9');
            $('#expandedRDiv').css("transform","translate(200%)");
            $('#expandedRDiv').css("transition","1s");
            // $('#mapCustom').removeClass('col-lg-6');
        }



/*--- Right Side Detail Panel ENDS--*/
//Sockets
        var socket = io.connect('54.165.204.15:6508');
    var token = localStorage.getItem('access_token');
    console.log(token);
    socketFactory.init();
    socket.emit('auth', {user_type: 'admin', access_token: token});
    socketFactory.on('authorised', function(data) {
        console.log(data);
        if(data.flag==true)
        {
     socket.emit('counterRides', {action: 0, region_id:0});
    socketFactory.on('counterRides', function(data) {
            console.log(data.data);
            $scope.sock1=data.data;
            $scope.totalItemsOngoing=$scope.sock1.ONGOING;
            $scope.totalItemsScheduled=$scope.sock1.SCHEDULED;
            $scope.totalItemsCompleted=$scope.sock1.COMPLETED;
    });
    socket.emit('ongoingRides', {action: 0, region_id:0});
    socketFactory.on('ongoingRides', function(data) {
            console.log('data in ongoing',data.data);
            $scope.sockog=data.data.paginated_rides;

            $scope.onGoingRidePag=$scope.sockog;

            //  $scope.totalItems=$scope.sock1.ONGOING;
            //  $scope.totalItemsScheduled=$scope.sock1.SCHEDULED;
            //  $scope.totalItemsCompleted=$scope.sock1.COMPLETED;
    });
    socket.emit('completedRides', {action: 0, region_id:0, limit:5});
    socketFactory.on('completedRides', function(data) {
            console.log('data in Completed',data.data);
            $scope.sockoc=data.data.paginated_rides;
            $scope.completedRides=$scope.sockoc;
            //  $scope.totalItems=$scope.sock1.ONGOING;
            //  $scope.totalItemsScheduled=$scope.sock1.SCHEDULED;
            //  $scope.totalItemsCompleted=$scope.sock1.COMPLETED;
    });
    socket.emit('scheduledRides', {action: 0, region_id:0});
    socketFactory.on('scheduledRides', function(data) {
            console.log('data in Scheduled',data.data);
            $scope.sockos=data.data.paginated_schedules;
            $scope.scheduled_rides=$scope.sockos;
            $scope.p=new Array();
            _.each($scope.sockos,function(key,value){
            $scope.p.push(_.pick(key,'pickup_latitude','pickup_longitude'));
               });
               console.log('Pick',$scope.p);
               var image = {
        url: 'assets/img/intransit_pickup.png', // image is 512 x 512
        scaledSize: new google.maps.Size(35, 60)
    };


               for(var i=0; i<$scope.p.length; i++){
                    var position = new google.maps.LatLng($scope.p[i].pickup_latitude , $scope.p[i].pickup_longitude);
                    //var position = {latitude: marker.position.lat() , longitude: marker.position.lng()};
                    //var labels="P"
                   //function showonmap
                   //console.log($scope.p[i].pickup_latitude);
                   //console.log($scope.p[i].pickup_longitude);
                    bounds.extend(position);
                    var  marker = new google.maps.Marker({
                    position: position,
                    icon:image,
                    map: map,
                    });
                    map.panTo(marker.position);

                    // new google.maps.Marker({position: {lat: i.pickup_latitude, lng: i.pickup_longitude}, map: map});


               }



            $scope.d=new Array();
            _.each($scope.sockos,function(key,value){
            $scope.d.push(_.pick(key,'manual_destination_latitude','manual_destination_longitude'));
               });
               console.log('Des',$scope.d);

     var image = {
        url: 'assets/img/assigned_delivery.png', // image is 512 x 512
        scaledSize: new google.maps.Size(35, 60)
    };
                    for(var i=0; i<$scope.d.length; i++){
                    var position = new google.maps.LatLng($scope.d[i].manual_destination_latitude , $scope.d[i].manual_destination_longitude);
                    //var position = {latitude: marker.position.lat() , longitude: marker.position.lng()};
                    //var labels="P"
                   //function showonmap
                   //console.log($scope.p[i].pickup_latitude);
                   //console.log($scope.p[i].pickup_longitude);
                    bounds.extend(position);
                    var  marker = new google.maps.Marker({
                    position: position,
                    icon:image,
                    map: map,
                    });
                    map.panTo(marker.position);

                    // new google.maps.Marker({position: {lat: i.pickup_latitude, lng: i.pickup_longitude}, map: map});


               }
               });
    // Drivers_Sockets

    socket.emit('availableDrivers', {offset:0,limit:10,action:0});
    socketFactory.on('availableDrivers', function(data) {
            $scope.avail=data.data.paginated_drivers;
            console.log('available',$scope.avail);


    var image = {
        url: 'assets/img/driver_intransit.png', // image is 512 x 512

    };

            $scope.avl=new Array();
             _.each($scope.avail,function(key,value){
            $scope.avl.push(_.pick(key,'current_location_latitude','current_location_longitude'));
               });
               console.log('Driver Data',$scope.l);
                for(var i=0; i<$scope.avl.length; i++){
                    var position = new google.maps.LatLng($scope.avl[i].current_location_latitude, $scope.avl[i].current_location_longitude);
                    var  marker = new google.maps.Marker({
                    position: position,
                    icon:image,
                    map: map,
                    });
                    map.panTo(marker.position);

                    // new google.maps.Marker({position: {lat: i.pickup_latitude, lng: i.pickup_longitude}, map: map});


               }
});

    socket.emit('busyDrivers', {offset:0,limit:10,action:0});
    socketFactory.on('busyDrivers', function(data) {
    $scope.busy=data.data.paginated_drivers;
    console.log("BUSY",$scope.busy);

   var image = {
        url: 'assets/img/driver_idle.png', // image is 512 x 512
    };
            console.log(image);
            $scope.bzy=new Array();
             _.each($scope.busy,function(key,value){
            $scope.bzy.push(_.pick(key,'current_location_latitude','current_location_longitude'));
               });
               console.log(' buzy dri',$scope.bzy);
                for(var i=0; i<$scope.bzy.length; i++){
                    var position = new google.maps.LatLng($scope.bzy[i].current_location_latitude, $scope.bzy[i].current_location_longitude);
                    var  marker = new google.maps.Marker({
                    position: position,
                    icon:image,
                    map: map,
                    });
                    map.panTo(marker.position);

                    // new google.maps.Marker({position: {lat: i.pickup_latitude, lng: i.pickup_longitude}, map: map});


               }
    });
    socket.emit('allDrivers', {offset:0,limit:10,action:0});
    socketFactory.on('allDrivers', function(data) {
           $scope.all=data.data.paginated_drivers;
           console.log('all',$scope.all);

    });




/* -----Search Sockets Left Panel----*/


 $scope.left;
 $scope.left.selectedIndex = 1;
 $scope.searchL=function(data, id)
 {
     if(id==0){
     socket.emit('ongoingRides', {offset:0,limit:10,action:0,searchFlag:1,searchString:data});
     socketFactory.on('ongoingRides', function(data) {
     $scope.sockos=data.data.paginated_schedules;
     $scope.scheduled_rides=data.data.paginated_schedules;

    });}
     if(id==1)
     {
     socket.emit('scheduledRides', {offset:0,limit:10,action:0,searchFlag:1,searchString:data});
     socketFactory.on('scheduledRides', function(data) {
     $scope.sockos=data.data.paginated_schedules;
     $scope.scheduled_rides=data.data.paginated_schedules;
     });}
 }


/* -----Search Sockets Left Panel Ends----*/




/* -----Search Sockets Right Panel----*/

    $scope.select;
    $scope.select.selectedIndex = 2;

    $scope.searchR=function(data, id){console.log("data is "+ data + "id "+id);
    if(id ===0){
                 socket.emit('availableDrivers', {offset:0,limit:10,action:0,searchFlag:1,searchString:data});
                 socketFactory.on('availableDrivers', function(data) {
                 $scope.avail=data.data.paginated_drivers;

    });}
    if(id === 1) {   console.log("data is "+ data + "id "+id);
                 socket.emit('busyDrivers', {offset:0,limit:10,action:0,searchFlag:1,searchString:data});
                 socketFactory.on('busyDrivers', function(data) {
                 $scope.busy=data.data.paginated_drivers;
    });}
    if(id === 2){     console.log("data is "+ data + "id "+id);
                 socket.emit('allDrivers', {offset:0,limit:10,action:0,searchFlag:1,searchString:data});
                 socketFactory.on('allDrivers', function(data) {
                 $scope.all=data.data.paginated_drivers;
    });}}


/* -----Search Sockets Right Panel Ends----*/


            socketFactory.on('notificationRides', function(data) {
            console.log('data notification ',data);
            // $scope.sockos=data.data.paginated_schedules;
            // $scope.scheduled_rides=$scope.sockos;
            // $scope.openToast('info', 'The Trip#  '+data.sessionId+' has been '+ data.status , '');
            toastr.info('The Trip#  '+data.sessionId+' has been '+ data.status , 'Information');

    });}

});
       $scope.$on('$destroy', function (event)
    {
           socket.disconnect()
     });
        // Styles a map in night mode.
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var bounds = new google.maps.LatLngBounds();

        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 40.674, lng: -73.945},
            zoom: 7,
            streetViewControl: false,
            mapTypeControl:false,

            styles: [
                {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
                {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
                {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
                {
                    featureType: 'administrative.locality',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#d59563'}]
                },
                {
                    featureType: 'poi',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#d59563'}]
                },
                {
                    featureType: 'poi.park',
                    elementType: 'geometry',
                    stylers: [{color: '#263c3f'}]
                },
                {
                    featureType: 'poi.park',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#6b9a76'}]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{color: '#38414e'}]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry.stroke',
                    stylers: [{color: '#212a37'}]
                },
                {
                    featureType: 'road',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#9ca5b3'}]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry',
                    stylers: [{color: '#746855'}]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'geometry.stroke',
                    stylers: [{color: '#1f2835'}]
                },
                {
                    featureType: 'road.highway',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#f3d19c'}]
                },
                {
                    featureType: 'transit',
                    elementType: 'geometry',
                    stylers: [{color: '#2f3948'}]
                },
                {
                    featureType: 'transit.station',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#d59563'}]
                },
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{color: '#17263c'}]
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [{color: '#515c6d'}]
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.stroke',
                    stylers: [{color: '#17263c'}]
                }
            ]

        });
    var labels = 'PD';
    var labelIndex = 0;
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    directionsDisplay.setMap(map);
    $scope.getDirections = function () {
    var request =
    {
      origin: $scope.strtloca,
      destination: $scope.mdes,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        alert('Google route unsuccesfull!');
      }
    });
  }

    $scope.showonm=function(data)
{
    $scope.strtloca=data.pickup_latitude+','+data.pickup_longitude;
    $scope.mdes=data.manual_destination_latitude+','+data.manual_destination_longitude;
    console.log($scope.strtloca);
    console.log( $scope.mdes);
    //$scope.showonmap(data);

}

$scope.isOpen==true;
$scope.tog=1;
    $scope.toggleRight=function(m)
    {
        $scope.tog=!$scope.tog;
        if($scope.tog==0)
        {
    $("#Nav").css('right','-400px');
    $('#ffff').removeClass('fa-chevron-right').addClass('fa-chevron-left');
        }
        else if($scope.tog==1)
        {
$("#Nav").css('right','0px');
$('#ffff').removeClass('fa-chevron-left').addClass('fa-chevron-right');
        }
//     $('##bttt').toggle(function(e){
//     e.stopImmediatePropagation();
//     e.preventDefault();
// });
    }
/*    $scope.showonmap = function (data) {
    var markers =
    [
        [ data.pickup_latitude,data.pickup_longitude],
        [ data.manual_destination_latitude,data.manual_destination_longitude]
        // $scope.p,
        // $scope.d,
    ];
    for(var  i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i][0], markers[i][1]);
        bounds.extend(position);
        var  marker = new google.maps.Marker({
        position: position,
        label: labels[labelIndex++ % labels.length],
        map: map,
        });
        map.panTo(marker.position);
        // map.fitBounds(bounds);
    }
  }*/

      var showonmap = function (position, labels) {
        bounds.extend(position);
        var  marker = new google.maps.Marker({
        position: position,
        label: labels,
        map: map,
        });
        map.panTo(marker.position);
        // map.fitBounds(bounds);

  }

var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(12);
        google.maps.event.removeListener(boundsListener);
    });}



// function buildToggler(navID) {
//       return function() {
//         // Component lookup should always be available since we are not using `ng-if`
//         $mdSidenav(navID)
//           .toggle()
//           .then(function () {
//             $log.debug("toggle " + navID + " is done");
//           });
//       };
//     }


})();




     //  Api Call For OnGoing Rides //
            var d={
                access_token: localStorage.getItem('access_token'),
                requestType: 1,
                limit:10,
                offset:$scope.skip
                  };
            $.post(MY_CONSTANT.url + '/v2/get_rides_by_type', d)
                .success(function (data, status) {
                    if (data.flag == 1200) {
                        console.log("HIT1")
                        console.log("OnGoing Ride Without Function", data);
                        if(typeof(data)=='string')
                        data = JSON.parse(data);
                        $scope.onGoingRide = data.total_rides;
                        var d = data;
                        console.log("d is declared", d);
                        // $scope.onGoingRidePag = d.paginated_rides;
                        $scope.onGoingRideZ= data.rides;
                        // $scope.totalItems = $scope.onGoingRide;
                    }
                })
                .error(function (data, status) {

            });
            //  Api Call For Completed Rides //
            var e={
                access_token: localStorage.getItem('access_token'),
                requestType: 2,
                offset:$scope.skip,
                limit:10

            };
            $.post(MY_CONSTANT.url + '/v2/get_rides_by_type', e)
                .success(function (data, status) {
                    if (data.flag == 1201) {
                        console.log("HIT 2")
                        console.log("Completed Ride Without Function", data);
                        if(typeof(data)=='string')
                        data = JSON.parse(data);
                        $scope.completedRide = data.total_rides;
                        var x = data;
                        console.log("x is declared", x);
                        // $scope.completedRides = x.paginated_rides;
                        $scope.completedRideZ= data.rides;
                        // $scope.dispatchesFound=1;
                    // $scope.totalItemsCompleted = $scope.completedRide;
                }

            })
            .error(function (data, status) {

            });

             //  Api Call For Scheduled Rides //

             var f={
            access_token: localStorage.getItem('access_token'),
            limit:10,
            offset:$scope.skip
        };
        $.post(MY_CONSTANT.url + '/scheduled_rides', f)
            .success(function (data, status) {
                console.log("HIT 3")
                    console.log("Scheduled Ride Without Function");
                    if(typeof(data)=='string')
                    data = JSON.parse(data);
                    $scope.scheduledRide = data.total_schedules;
                    var z = data;
                    console.log("z is declared", z);
                    // $scope.scheduled_rides = z.paginated_rides;
                    $scope.scheduledRideZ= data.rides;
                    // $scope.dispatchesFound=1;
                    // $scope.totalItemsScheduled = $scope.scheduledRide;

            })
            .error(function (data, status) {

        });
        $scope.completeds = function () {
            $('#expandedDiv').css("transform","translate(-200%)");
            $('#mapCustom').removeClass('col-lg-6');
            $('#mapCustom').css("margin-left","23%");
            $('#mapCustom').css("position","absolute","important");
            $scope.expand = 1;
            $scope.completed = 1;
            $scope.scheduled = 0;
            $scope.onGoing = 0;
            $('.completed').addClass('activeNew');
            $('.scheduled').removeClass('activeNew');
            $('.parent').removeClass('activeNew');
            var e={
                access_token: localStorage.getItem('access_token'),
                requestType: 2,
                limit:10,
                offset:$scope.skip
            };
            $.post(MY_CONSTANT.url + '/v2/get_rides_by_type', e)
                .success(function (data, status) {
                    if (data.flag == 1201) {
                        console.log("success in getting completed rides data", data);
                        if(typeof(data)=='string')
                            data = JSON.parse(data);
                        $scope.completedRide = data.total_rides;
                        var x = data;
                        console.log("d is declared", x);
                        // $scope.completedRides = x.paginated_rides;
                        $scope.completedRideZ= data.rides;
                        // $scope.dispatchesFound=1;
                        // $scope.totalItemsCompleted = $scope.completedRide;
                        // console.log("total items are", $scope.totalItemsCompleted);
                    }
                })
                .error(function (data, status) {

                });
        }

            var token = localStorage.getItem('access_token');
            socketFactory.init();
            socket.emit('auth', {user_type: 'admin', access_token: token});
            socketFactory.on('authorised', function(data) {
                    console.log(JSON.stringify(data));
            });
            socket.emit('counterRides', {action: 0, region_id:0});
            socketFactory.on('counterRides', function(data) {
                    console.log('*******',data.data);
                      $scope.sock1=data.data;

                     $scope.totalItems=$scope.sock1.ONGOING;
                     $scope.totalItemsScheduled=$scope.sock1.COMPLETED
                     $scope.totalItemsCompleted=$scope.sock1.SCHEDULED;
            });
            socketFactory.emit('data', {user_type: 'admin', access_token: token});
            socketFactory.on('message', function(data) {
                       console.log(JSON.stringify(data));
            });
            socketFactory.on('data', function(data) {
               console.log(JSON.stringify(data));
            });

            socketFactory.emit('auth',{'type':1}  , function(data) {
                console.log(data);
               console.log("sdfsdf"+JSON.stringify(data));
            });


            socketFactory.on('data', function(data) {
                console.log(data.v);
                $scope.totalItems=data.v;
                $scope.totalItemsScheduled=data.w;
                $scope.totalItemsCompleted=data.x;
               console.log(JSON.stringify(data));
            });











  socket.on('connect', function(){

            socket.emit('auth', {user_type: 'admin', access_token: token});
            socket.on('authorised', function(data) {
                if(data.flag === true){
                    socket.emit('action',{
                        'flag':[0],
                        'action':1,
                        'skip':0,
                        'limit':100,
                        'data':{
                            'region_id':1
                        }

            });
                    socket.on('data', function (data) {
                        console.log(data);
                        console.log(JSON.stringify(data));
                        $scope.newBut = data.data.NEW;
                        $scope.assignedBut = data.data.ASSIGNED;
                        $scope.pickedUpBut = data.data.PICKEDUP;
                        $scope.inRouteBut = data.data.INROUTE;
                        $scope.deliveredBut = data.data.DELIVERED;
                        $scope.closedBut = data.data.CLOSED;
                        $scope.tempNewBut = $scope.newBut;
                        $scope.tempassignedBut = $scope.assignedBut;
                        $scope.tempPickedUpBut = $scope.pickedUpBut;
                        $scope.tempInrouteBut = $scope.inRouteBut;
                        $scope.tempDeliveredBut = $scope.deliveredBut;
                        $scope.tempClosedBut = $scope.closedBut;
                        if(data.data.NEW != $scope.tempNewBut){
                            $scope.newBut = data.data.NEW;
                        }
                        $scope.$apply();
                       console.log("closed but is", $scope.closedBut);
                    });
                }
                //console.log('User is authenticated');
            });

    });


        $scope.onGoings = function () {
            $('#expandedDiv').css("transform","translate(-200%)");
            $('#mapCustom').removeClass('col-lg-6');
            $('#mapCustom').css("margin-left","20%");
            $('#mapCustom').css("position","absolute","important");
            $scope.expand = 1;
            $scope.onGoing = 1;
            $scope.scheduled = 0;
            $scope.completed = 0;
            $('.parent').addClass('activeNew');
            $('.scheduled').removeClass('activeNew');
            $('.completed').removeClass('activeNew');
            var d={
                access_token: localStorage.getItem('access_token'),
                requestType: 1,
                offset:$scope.skip,
                limit:10

            };
            $.post(MY_CONSTANT.url + '/v2/get_rides_by_type', d)
                .success(function (data, status) {
                    if (data.flag == 1200) {
                        console.log("Ongoing Ride Data using F", data);
                        if(typeof(data)=='string')
                        data = JSON.parse(data);
                        $scope.onGoingRide = data.total_rides;
                        var d = data;
                        console.log("d is declared", d);
                        $scope.onGoingRidePag = d.paginated_rides;
                        // $scope.onGoingRideZ= data.rides;
                        // $scope.dispatchesFound=1;
                        $scope.totalItems = $scope.onGoingRide;
                        console.log("total items are", $scope.totalItems);
                    }

                })
                .error(function (data, status) {

                });
        }
        $scope.scheduleds = function () {
            $('#expandedDiv').css("transform","translate(-200%)");
            $('#mapCustom').removeClass('col-lg-6');
            $('#mapCustom').css("margin-left","20%");
            $('#mapCustom').css("position","absolute","important");
            $scope.expand = 1;
            $scope.scheduled = 1;
            $scope.completed = 0;
            $scope.onGoing = 0;
            $('.scheduled').addClass('activeNew');
            $('.parent').removeClass('activeNew');
            $('.completed').removeClass('activeNew');
            var f={
                access_token: localStorage.getItem('access_token'),
                limit:10,
                offset:$scope.skip
            };
            $.post(MY_CONSTANT.url + '/scheduled_rides', f)
                .success(function (data, status) {

                    if(typeof(data)=='string')
                    data = JSON.parse(data);
                    $scope.scheduledRide = data.total_schedules;
                    var z = data;
                    // console.log("z is declared", z);
                    // $scope.scheduled_rides = z.paginated_schedules;
                    // console.log("scheduled rides are", $scope.scheduled_rides);
                    $scope.scheduledRideZ= data.all_schedules;
                    // $scope.dispatchesFound=1;
                    $scope.totalItemsScheduled = $scope.scheduledRide;
                    console.log("total items are", $scope.totalItemsScheduled);
                })
                .error(function (data, status) {

                });
        }
