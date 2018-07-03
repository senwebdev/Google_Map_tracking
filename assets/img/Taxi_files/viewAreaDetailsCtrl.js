/* Copyrights-Developed by Taxi Technologies INC. */
(function() {
  'use strict';

  angular.module('BlurAdmin.pages.geoFencing.viewAreaDetails')
  .controller('viewAreaDetailsCtrl', viewAreaDetailsCtrl);

  function viewAreaDetailsCtrl($timeout,$rootScope, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter) {
    $rootScope.showloader=true;
    if (localStorage.getItem('region_id')) {
      $scope.region_id = localStorage.getItem('region_id');
    } else $state.go('geoFencing.viewArea');
    $scope.init = function() {
      $scope.region = {};
      $scope.startEdit=0;
      $.post(MY_CONSTANT.url + '/get_regional_details', {
        region_id: $scope.region_id,
        access_token: localStorage.getItem('access_token')
      })
      .success(function(data, status) {
        if (data.flag == 1509) {
          alert("No Such region");
          $state.go('geoFencing.viewArea');
        }
        if (data.flag == 1506) {
          var arr = [];
          var d = data;
          console.log(d);
          $scope.region = d.region_details;
          $scope.region.added_at = moment($scope.region.added_at).format('MMM DD YYYY, hh:mm A');
          $scope.fares = d.fares;
          for(var i=0;i<$scope.fares.length;i++){
            $scope.fares[i].notSet=0;
            if($scope.fares[i].fare_fixed==null){
              $scope.fares[i].notSet=1;
              $scope.fares[i].fare_fixed='';
            }
            if($scope.fares[i].cancellation_fee==null)$scope.fares[i].cancellation_fee='';
            if(!$scope.fares[i].cancellation_time)$scope.fares[i].cancellation_time='';
            if($scope.fares[i].black_car_fund==null)$scope.fares[i].black_car_fund='';
            if($scope.fares[i].fare_per_km==null)$scope.fares[i].fare_per_km='';
            if($scope.fares[i].fare_per_min==null)$scope.fares[i].fare_per_min='';
            if($scope.fares[i].id==null)$scope.fares[i].id='';
            if($scope.fares[i].minimum_fare==null)$scope.fares[i].minimum_fare='';
            if($scope.fares[i].sales_tax==null)$scope.fares[i].sales_tax='';
          }
          console.log($scope.fares);
          $scope.faresReset=$scope.fares;
          localStorage.setItem('fares',JSON.stringify($scope.fares));
          $scope.$apply();
          $("input").prop('disabled', true);
          $rootScope.showloader=false;
          var dtInstance;
          $scope.$apply(function() {
          $timeout(function() {
            if (!$.fn.dataTable) return;
            dtInstance = $('#dataTableFareDetails').dataTable({
              'paging': true, // Table pagination
              'ordering': true, // Column ordering
              'info': true, // Bottom left status text
              "scrollX": "2200px",
              "scrollY": "400px",
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
          }, 1000);
          $scope.$on('$destroy', function() {
            dtInstance.fnDestroy();
            $('[class*=ColVis]').remove();
          });
        });
        }
        // $scope.$apply();s
      })
    }
    $scope.init();

    $scope.viewDocs = function() {
      $state.go('drivers.documents');
      localStorage.setItem('driverID', $scope.driverID);
      localStorage.setItem('driverName', $scope.driver.driver_name);
    }
    $scope.fareDetails='';

    $scope.mode='saved';

    $scope.editDetails = function(data){
      $scope.fareDetails=data;
      $scope.fareDetails.file_name='';
      $scope.fareDetails.cancellation_time=parseInt($scope.fareDetails.cancellation_time);
      $scope.startEdit=1;
      $scope.editFareDetails('edit');
    }
    // $scope.carSelect = function(car){
    //   console.log(car);
    //   if(car==null){
    //     $scope.fareDetails='';
    //   }
    //   else if(car!=null){
    //     $scope.fareDetails=car;
    //     $scope.fareDetails.file_name='';
    //     $scope.fareDetails.cancellation_time=parseInt($scope.fareDetails.cancellation_time);
    //     console.log($scope.fareDetails);
    //   }
    // }
    $scope.editFareDetails = function(mode) {
      $scope.mode=mode;
      if(mode=='edit'){
        $scope.fareBackUp=$scope.fareDetails;
        $(".faresForm input").prop('disabled', false);
      }
      else{
        console.log($scope.faresReset);
        console.log($scope.fareBackUp);
        $scope.fareDetails=$scope.fareBackUp;
        // $scope.fares=$scope.faresReset;
        if(!$scope.fareDetails.cancellation_time)$scope.fareDetails.cancellation_time='';
        $scope.faresReset=JSON.parse(localStorage.getItem('fares'))
        $(".faresForm input").prop('disabled', true);
        $scope.startEdit=0;
      }

    }
    $scope.back = function() {
      $state.go('geoFencing.viewArea');
    }

    $scope.file_to_upload = function (files) {
        processfile(files[0]);
        // $scope.doc.doc_file=files[0];
        $scope.fareDetails.file_name= files[0].name;
        $scope.$apply();
    }
    function processfile(file) {

    if( !( /image/i ).test( file.type ) )
        {
            alert( "File "+ file.name +" is not an image." );
            return false;
        }

    // read the files
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = function (event) {
      // blob stuff
      var blob = new Blob([event.target.result]); // create blob...
      window.URL = window.URL || window.webkitURL;
      var blobURL = window.URL.createObjectURL(blob); // and get it's URL

      // helper Image object
      var image = new Image();
      image.src = blobURL;
      //preview.appendChild(image); // preview commented out, I am using the canvas instead
      image.onload = function() {
        // have to wait till it's loaded
        var resized = resizeMe(image); // send it to canvas
        // console.log(resized);
        $scope.dataURItoBlob(resized);
      }
    };
}
function resizeMe(img) {

    var canvas = document.createElement('canvas');

    var width = img.width;
    var height = img.height;
    var max_width=1024;
    var max_height=720;
    // calculate the width and height, constraining the proportions
    if (width > height) {
      if (width > max_width) {
        //height *= max_width / width;
        height = Math.round(height *= max_width / width);
        width = max_width;
      }
    } else {
      if (height > max_height) {
        //width *= max_height / height;
        width = Math.round(width *= max_height / height);
        height = max_height;
      }
    }

    // resize the canvas and draw the image data into it
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    // preview.appendChild(canvas); // do the actual resized preview

    return canvas.toDataURL("image/jpeg",0.7); // get the data from canvas as 70% JPG (can be also PNG, etc.)

  }
  $scope.dataURItoBlob = function(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob= new Blob([ab], { type: 'image/jpeg' });
    $scope.fareDetails.car_type_image=blob;
    // $scope.$apply();
  };
    $scope.saveFareDetails = function(fareDetails) {
      var image=0;
      var form = new FormData();
      form.append('access_token',localStorage.getItem('access_token'));
      form.append('region_id',parseInt($scope.region.region_id));
      form.append('car_type',parseInt(fareDetails.car_type));
      form.append('fare_per_km',parseInt(fareDetails.fare_per_km));
      form.append('fare_per_min',parseInt(fareDetails.fare_per_min));
      form.append('fare_fixed',parseInt(fareDetails.fare_fixed));
      form.append('black_car_fund',parseInt(fareDetails.black_car_fund));
      form.append('sales_tax',parseInt(fareDetails.sales_tax));
      form.append('minimum_fare',parseInt(fareDetails.minimum_fare));
      form.append('cancellation_fee',parseInt(fareDetails.cancellation_fee));
      form.append('cancellation_time',fareDetails.cancellation_time.toString());
      if(fareDetails.file_name==''){
        image=0;
        form.append('image_flag',0);
      }
      else {
        image=1;
        form.append('image_flag',1);
        form.append('car_type_image',fareDetails.car_type_image);
      }
      if(fareDetails.notSet==0){
        $http.post(MY_CONSTANT.url + '/update_regional_fare',form, {
          headers:{'Content-Type':undefined}
        })
        .success(function(data, status) {
          console.log(data.flag);
          $scope.mode='saved';
          if (data.flag == 1509) {
            // alert("No Such region");
            $rootScope.openToast('error','No Such Region','');
            $state.reload();
          }
          if (data.flag == 1512||data.flag == 1513) {
            // alert('Fare Updated Sucessfully');
            $rootScope.openToast('success','Fare Updated Sucessfully','');
            $state.reload();
          }
        })
      }
      else{
        $http.post(MY_CONSTANT.url + '/add_regional_fare',form, {
          headers:{'Content-Type':undefined}
        })
        .success(function(data, status) {
          console.log(data.flag);
          $scope.mode='saved';
          if (data.flag == 1509) {
            // alert("No Such region");
            $rootScope.openToast('error','No Such Region','');
            $state.reload();
          }
          if (data.flag == 1512||data.flag == 1513) {
            // alert('Fare Added Sucessfully');
            $rootScope.openToast('success','Fare Added Sucessfully','');
            $state.reload();
          }
        })
      }
    }
  }
})();
