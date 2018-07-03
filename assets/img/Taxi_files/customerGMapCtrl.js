(function () {
  'use strict';

  angular.module('BlurAdmin.pages.track.customerTracking')
      .controller('customerGMapCtrl', CGmapPageCtrl);
  function CGmapPageCtrl($timeout,$rootScope,$interval,$scope,$http,MY_CONSTANT,baSidebarService) {
    console.log("asdasf");
    $rootScope.showloader=true;
    var markerCount = 0;
    var searchMarkers = [];
    var bound_val =0;
    $scope.total_no_of_users = "";
    $scope.MapTitle = "Driver Name";
    var myCenter=new google.maps.LatLng(30.7500,76.7800);
    var mc2=null;
    var icon=null;
    var markers2=[];
    var searchBox=null;
    var mapProp = {
      center:myCenter,
      zoom:2,
      zoomControl: true,
      zoomControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE,
          position:google.maps.ControlPosition.LEFT_TOP
      },
      fullscreenControl:true,
      fullscreenControlOptions: {
          position:google.maps.ControlPosition.LEFT_TOP
      },
      mapTypeId:google.maps.MapTypeId.ROADMAP,
      styles: [{"elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"road","elementType":"labels.icon"},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"water","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"poi.park","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]}]
    };
    var mcOptions = {
      gridSize: 50,
      maxZoom: 15,
      imagePath:'assets/img/taxi/m1.png'
    };
    $scope.drawMap=function()
    {
      $rootScope.showloader=false;
      $.post(MY_CONSTANT.url + '/user_list', {
            access_token:localStorage.getItem('access_token')
      })
          .success(function(data,status){
            console.log(data.total_users);
            $scope.total_no_of_users='Live Tracking (No. Of Customers '+data.total_users+' )';
            //$scope.$apply();
            var tasks=data.users;
            initialize1(tasks);
          })
          .error(function(response,error){
            //alert(error);
          });

    };
      $scope.drawMap();
      var mapCentre;
      $interval(function(){
          if(window.location.href.indexOf('customerTracking')>-1)
              $scope.drawMap();
      },30000);

      $scope.fullScreen='Full Screen';
      $scope.fullscreenToggle = function(){
          if($scope.fullScreen=='Full Screen'){
              $scope.fullScreen='Exit Full Screen';
              $('#pieCharts').css('display','none');
              baSidebarService.setMenuCollapsed(true);
              $('page-top').css('visibility','hidden');
              $('.al-main').css('padding-top',0);
              $('.al-sidebar').css('top',0);

              $('#google-mapsCustomer').css('height','90vh');
          }
          else {
              $('#pieCharts').css('display','block');
              $('#google-mapsCustomer').css('height','60vh');
              baSidebarService.setMenuCollapsed(false);
              $('page-top').css('visibility','visible');
              $('.al-main').css('padding-top','66px');
              $('.al-sidebar').css('top','66px');
              $scope.fullScreen='Full Screen';
          }
      };


      //     ============ Search box===================
    var initialize1 = function(info1)
      {
          var input = document.getElementById('pac-input-customer');
          var fullScreen = document.getElementById('fullScreen');
          $scope.mapContainer = new google.maps.Map(document.getElementById('google-mapsCustomer'), mapProp);
          $scope.mapContainer.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
          // $scope.mapContainer.controls[google.maps.ControlPosition.TOP_RIGHT].push(fullScreen);
            if(localStorage.mapLat!=null && localStorage.mapLng!=null && localStorage.mapZoom!=null){
                mapProp = {
                    center: new google.maps.LatLng(localStorage.mapLat,localStorage.mapLng),
                    zoom: parseInt(localStorage.mapZoom),
                    scaleControl: true,
                    zoomControl: true,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.LARGE,
                        position:google.maps.ControlPosition.LEFT_TOP
                    },
                    mapTypeId:google.maps.MapTypeId.ROADMAP,
                    fullscreenControl:true,
                    fullscreenControlOptions: {
                        position:google.maps.ControlPosition.LEFT_TOP
                    },
                    styles: [{"elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"road","elementType":"labels.icon"},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"water","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"poi.park","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]}]
                };
            }
          searchBox = new google.maps.places.SearchBox(input);
          $scope.mapContainer.addListener('bounds_changed', function() {
        searchBox.setBounds($scope.mapContainer.getBounds());
      });
      mc2 = new MarkerClusterer($scope.mapContainer, [], mcOptions);
      google.maps.event.addListener($scope.mapContainer, 'click', function() {
        infowindow.close();
      });
        mapCentre = $scope.mapContainer.getCenter();
        //Set local storage variables.
        localStorage.mapLat = mapCentre.lat();
        localStorage.mapLng = mapCentre.lng();
        localStorage.mapZoom = $scope.mapContainer.getZoom();

        google.maps.event.addListener($scope.mapContainer,"center_changed", function() {
            //Set local storage variables.
            mapCentre = $scope.mapContainer.getCenter();
            localStorage.mapLat = mapCentre.lat();
            localStorage.mapLng = mapCentre.lng();
            localStorage.mapZoom = $scope.mapContainer.getZoom();
        });

        google.maps.event.addListener($scope.mapContainer,"zoom_changed", function() {
            //Set local storage variables.
            mapCentre = $scope.mapContainer.getCenter();
            localStorage.mapLat = mapCentre.lat();
            localStorage.mapLng = mapCentre.lng();
            localStorage.mapZoom = $scope.mapContainer.getZoom();
            // console.log(localStorage);
        });
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // Clear out the old markers.
        searchMarkers.forEach(function(marker) {
          marker.setMap(null);
        });
        searchMarkers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          var icon = {
            url: place.icon,
            size: new google.maps.Size(2, 2),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          searchMarkers.push(new google.maps.Marker({
            map: $scope.mapContainer,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        $scope.mapContainer.fitBounds(bounds);
      });
        markers2=[];
      for(var i=0;i<info1.length;i++){
        if(info1[i].status){
          icon = 'assets/img/taxi/marker_red.svg';
        }
        else{
          if(info1[i].is_available==1){
            icon = 'assets/img/taxi/marker_green.svg';
          }
          else{
            icon = 'assets/img/taxi/marker_black.svg';
          }
        }
        // createMarker2(new google.maps.LatLng(info1[i].current_location_latitude,
        //     info1[i].current_location_longitude),info1[i].user_name,info1[i].user_email,info1[i].phone_no,info1[i].car_name,info1[i].driver_car_no,icon);
        createMarker2(new google.maps.LatLng(info1[i].current_location_latitude,
            info1[i].current_location_longitude),info1[i].user_name,info1[i].user_email,info1[i].user_mobile,icon);
      }
      mc2.addMarkers(markers2 , true);
    };
    var infowindow = new google.maps.InfoWindow({
      size: new google.maps.Size(150, 50)
    });
    // function createMarker2(latlng,name,email,phone,car_name,driver_no,icon) {
    function createMarker2(latlng,name,email,phone,icon) {
      var marker = new google.maps.Marker({
        position: latlng,
        map: $scope.mapContainer,
        icon: icon,
        zIndex: Math.round(latlng.lat() * -100000) << 5
      });

      marker.content='<div class="infoWindowContent">' + 'Name:'+" "+name+'<br>Email:'+" "+email+'<br>Mobile:'+" "+phone+'<br></div>';

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(marker.content);
        infowindow.open($scope.mapContainer, marker);
      });
      markers2.push(marker); //push local var marker into global array
    }
    $scope.setBounds = function(){
      if(bound_val==0){
        var bounds = new google.maps.LatLngBounds();
        for(var i=0;i<markerCount;i++) {
          bounds.extend(markerArr[i].getPosition());
        }
        $scope.mapContainer.fitBounds(bounds);
      }
      return 1;
    };
    /*function initialize() {
      var mapCanvas = document.getElementById('google-maps');
      var mapOptions = {
        center: new google.maps.LatLng(44.5403, -78.5463),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(mapCanvas, mapOptions);
    }

    $timeout(function(){
      initialize();
    }, 100);*/
  }
})();
