/* Copyrights-Developed by Taxi Technologies INC. */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.editUser')
        .controller('editUserCtrl', editUserCtrl);

    function editUserCtrl($timeout, $rootScope, $scope, $http, MY_CONSTANT, ngDialog, $state, $filter) {
        $rootScope.showloader = false;
        $scope.back = function() {
            $state.go('passengers')
        }
        if (!localStorage.getItem('userData')) {
            $state.go('passengers');
        } else {
            $rootScope.showloader = false;
            $scope.user = {};
            $scope.user.tlc_number = '';
            $scope.user.dmv_license = '';
            $scope.user = JSON.parse(localStorage.getItem('userData'));
            $scope.userID = $scope.user.user_id;
            if ($scope.user.uber_rating > 0) $scope.user.uberUser = 'Yes';
            else $scope.user.uberUser = 'No';
            if ($scope.user.lyft_rating > 0) $scope.user.lyftUser = 'Yes';
            else $scope.user.lyftUser = 'No';
            $scope.userProfile = 'user ID ' + $scope.user.user_id;
            console.log($scope.user);
            var m = $scope.user.user_mobile.split('-');
            $scope.user.countrycode= m[0];
            $scope.user.user_mobile = m[1];
            $scope.mobile= m[1];
            $scope.email= $scope.user.user_email;
            $scope.userTemp = {};
            $scope.userTemp = $scope.user;
        }

        $scope.dataURItoBlob = function(dataURI) {
            // console.log(dataURI);
            var byteString = atob(dataURI.split(',')[1]);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var blob = new Blob([ab], {
                type: 'image/jpeg'
            });
            // console.log(blob);
            $scope.userTemp.user_image = dataURI;
            $scope.userTemp.user_image_file = blob;
            $scope.$apply();
        };
        $scope.file_to_upload = function(files) {
            console.log(files);
            if (!files || files.length == 0) {

                $scope.userTemp.user_image = '';
                $scope.userTemp.user_image_name = '';
                $scope.$apply();
                return false;
            }

            processfile(files[0]);
            $scope.userTemp.user_image_name = files[0].name;


            $scope.$apply();
        };

        function processfile(file) {
            if (!file) {

                $scope.userTemp.user_image = '';
                $scope.userTemp.user_image_name = '';
                $scope.$apply();
                return false;
            }
            if (!(/image/i).test(file.type)) {
                alert("File " + file.name + " is not an image.");
                return false;
            }

            // read the files
            var reader = new FileReader();
            reader.readAsArrayBuffer(file);

            reader.onload = function(event) {
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
            var max_width = 1024;
            var max_height = 720;
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

            return canvas.toDataURL("image/jpeg", 0.7); // get the data from canvas as 70% JPG (can be also PNG, etc.)

        }
        $scope.userTemp.user_image_name='';
        $scope.editSave = function() {
            console.log("sdfg");
            var form = new FormData();
            if($scope.userTemp.user_image_name!=''){
              $scope.userTemp.image_flag = 1
              form.append("image",$scope.userTemp.user_image_file);
            }
            else {
              $scope.userTemp.image_flag = 0;
            }
            console.log($scope.userTemp.user_mobile);
            console.log($scope.user.user_mobile);
            if($scope.userTemp.user_email!=$scope.email)$scope.userTemp.is_email_changed = 1;
            else $scope.userTemp.is_email_changed = 0;
            if($scope.userTemp.user_mobile!=$scope.mobile)$scope.userTemp.is_mobile_changed = 1;
            else $scope.userTemp.is_mobile_changed = 0;
            $scope.userTemp.with_otp=0;

            form.append("user_id",$scope.userID);
            form.append("access_token",localStorage.getItem('access_token'));
            form.append("user_name",$scope.userTemp.user_name);
            form.append("user_mobile",$scope.userTemp.countrycode+'-'+$scope.userTemp.user_mobile);
            form.append("user_email",$scope.userTemp.user_email);
            form.append("is_mobile_changed",$scope.userTemp.is_mobile_changed);
            form.append("is_email_changed",$scope.userTemp.is_email_changed);
            form.append("with_otp",$scope.userTemp.with_otp);
            form.append("image_flag",$scope.userTemp.image_flag);
            $http.post(MY_CONSTANT.url + '/edit_user', form,{headers: {
                    'Content-Type': undefined
                }})
                .success(function(data, status) {
                    console.log(data);
                    $rootScope.openToast('success','User profile saved successfully','');
                    $state.go('passengers');
                })


        }
    }
})();
