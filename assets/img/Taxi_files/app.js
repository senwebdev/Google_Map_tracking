/* Copyrights-Developed by Taxi Technologies INC. */
'use strict';
angular.module('BlurAdmin', [
  'ngAnimate',
  'ui.bootstrap',
  'ui.sortable',
  'ui.router',
  'ngTouch',
  'toastr',
  'smart-table',
  "xeditable",
  'ui.slimscroll',
  'ngJsTree',
  'ngDialog',
  'ngBootstrap',
  'angular-progress-button-styles',
  'BlurAdmin.theme',
  'BlurAdmin.pages',
    'ngMaterial',
    'ngAnimate',
    'ngAria',
    'md.data.table',
    'daterangepicker'
]);
angular.module('BlurAdmin').run(appRun);
function appRun($rootScope,$http,MY_CONSTANT,$state,$location,toastr, toastrConfig) {
  var defaultConfig = angular.copy(toastrConfig);
  $rootScope.types = ['success', 'error', 'info', 'warning'];
  var openedToasts = [];
  $rootScope.options = {
    autoDismiss: false,
    positionClass: 'toast-top-right',
    type: 'info',
    timeOut: '3000',
    extendedTimeOut: '2000',
    allowHtml: false,
    closeButton: false,
    tapToDismiss: true,
    progressBar: false,
    newestOnTop: true,
    maxOpened: 0,
    preventDuplicates: false,
    preventOpenDuplicates: false,
    title: "Title",
    msg: "Message"
  };
console.log("1");
  $rootScope.clearLastToast = function () {
    var toast = openedToasts.pop();
    toastr.clear(toast);
  };

  $rootScope.clearToasts = function () {
    toastr.clear();
  };
  $rootScope.openToast = function (type,msg,title) {
    angular.extend(toastrConfig, $rootScope.options);
    openedToasts.push(toastr[type](msg, title));
    var strOptions = {};
    for (var o in  $rootScope.options) if (o != 'msg' && o != 'title')strOptions[o] = $rootScope.options[o];
    $rootScope.optionsStr = "toastr." + type + "(\'" + msg + "\', \'" + title + "\', " + JSON.stringify(strOptions, null, 2) + ")";
  };

  $rootScope.$on('$destroy', function iVeBeenDismissed() {
    angular.extend(toastrConfig, defaultConfig);
  })
  $rootScope.resetPass = {};
  $rootScope.text = "";
  $rootScope.show_reset=0;
  $rootScope.show_err=0;
  var type = $location.search().type;
  var token = $location.search().token;
  var email = $location.search().email;
  if(email)email = email.replace(' ', '+');
  // console.log(type);
  // console.log(token);
  // console.log(email);
  //   if($(window).width()<1050){
  //       baSidebarService.setMenuCollapsed(false);
  //       $('.al-main').addClass('expandAlMain');
  //   }
  $rootScope.authenticate = function(){
    // console.log("asd");
    auth = localStorage.getItem('access_token');
    // console.log(auth);

    if(auth != null) {
      $rootScope.$auth = true;
      $rootScope.$reset=false;
      $rootScope.showloader=true;
      // console.log($rootScope.$auth);
      // console.log($rootScope.$pageFinishedLoading);
      $rootScope.$apply();
      // $state.go('passengers');
      // window.history.pushState('',document.title,'index.html#/passengers');
      // window.location.href='index.html';
    }
    else {
      //window.location.href="index.html";window.history.pushState('',document.title,'index.html');
      $rootScope.$auth = false;
    }
  };
  if(token&&email){
    $rootScope.$auth = false;
    $rootScope.$reset=true;
    $http.post(MY_CONSTANT.url + '/check_verification_token',
        {
          email: email,
          token: token
        }).success(
        function (data,status) {
          if(data.status == 200) {
            $rootScope.show_reset=1;
          }
          else {
            $rootScope.show_reset=1;
            // $rootScope.show_err=1;
          }
        });


    if(typeof type != 'undefined'){

      $rootScope.text = "GENERATE PASSWORD";
    }
    else{
      $rootScope.text = "RESET PASSWORD";
    }




  }
  else {
    $rootScope.authenticate();
  }
  var auth='';

  $rootScope.forgotDiv = function () {
    // console.log("click");
    $rootScope.authMsg = "";
    $('.forgotDiv').css('display','block');
    $('.signInDiv').css('display','none');
    $('.resetDiv').css('display','none');

  };
  $rootScope.loginDiv = function () {
    console.log("click");
    $rootScope.$reset=false;
    $rootScope.authMsg = "";
    window.history.pushState('',document.title,'index.html');
    $('.resetDiv').css('display','none');
    $('.forgotDiv').css('display','none');
    $('.signInDiv').css('display','block');

  };
  $rootScope.resetPassword = function () {
    $rootScope.authMsg = '';
    if($rootScope.resetPass.password != $rootScope.resetPass.confirmpassword){
      $rootScope.authMsg = "Passwords do not match.";
      setTimeout(function () {
        $rootScope.authMsg = "";
      }, 3000);

    }
    else{
      $http.post(MY_CONSTANT.url + '/change_forgot_password',
          {
            email: email,
            token: token,
            password: $rootScope.resetPass.password
          }).success(function (data,status) {

        if (data.status !=200) {
          // if(data.message=='Invalid acess token.')
          $rootScope.authMsg = "The token for this request has expired";
          setTimeout(function () {
            $rootScope.authMsg = "";
            window.history.pushState('',document.title,'index.html');
          }, 2000);
        }
        else if(data.status == 200) {
          $rootScope.authMsg = "Password reset successfully.";
          setTimeout(function () {
            window.location.href='index.html';
          }, 2000);
        }
        else {
          $rootScope.authMsg = data.message.toString();
          setTimeout(function () {
            $rootScope.authMsg = "";
          }, 2000);
        }
      });
    }

  };
    $rootScope.date = new Date();
    $rootScope.timeOfDay = $rootScope.date.getHours();
    if(($rootScope.timeOfDay>=0) && ($rootScope.timeOfDay<=12)){
        $rootScope.timetoDis = 'AM';
    }
    else $rootScope.timetoDis = 'PM';
    console.log("date is",$rootScope.date);
    // $rootScope.time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  $rootScope.forgotEmail='';
  $rootScope.recover = function (a) {
    $rootScope.authMsg = '';
    $http.post(MY_CONSTANT.url + '/forgot_password',
        {
          email: a
        }).success(function (data,status) {
            if(data.message=='Invalid Email ID') {
              $rootScope.authMsg = "Email is not registered as admin";
              setTimeout(function () {
                $rootScope.authMsg = '';
              }, 3000);
            }
            else {

              $rootScope.authMsg = "Please check your email to reset password.";
              setTimeout(function () {
                $rootScope.authMsg = '';
              }, 3000);
            }

        })
        .error(function (data,status) {
            $rootScope.authMsg = "Email is not registered as admin";
            //$rootScope.successMsg = data.message.toString();
            setTimeout(function () {
              $rootScope.authMsg = "";
            }, 3000);
        })
  };
  $rootScope.login = function (a, b) {
    console.log(a, b);
    if (a == "" || b == "") {
    }
    else {
      $rootScope.authMsg = '';
      $.post(MY_CONSTANT.url + '/admin_login',
          {
            email: a,
            password: b
          })
          .success(function (data, status) {
            // data=JSON.parse(data);
            console.log('Starting ', data,status);
            
            //   if(data.message=='Logged in successfully.'&&data.data.type==0) {
            //       localStorage.setItem('access_token', data.data.access_token);
            //       $rootScope.auth = true;
            //       $rootScope.type=0;
            //       $rootScope.authenticate();
            //   }
            //   else if(data.message=='Logged in successfully.'&&data.data.type==1){
            //       $rootScope.authMsg="Access Denied";
            //       $rootScope.type=1;
            //       $rootScope.auth = false;
            //   }
            // else {
            //   $rootScope.authMsg=data.message;
            // }
            console.log(data.flag);
            
            if(data.flag==133){
                    localStorage.setItem('access_token', data.access_token);
                    $rootScope.auth = true;
                    $rootScope.type=0;
                    $rootScope.authenticate();
            }
            else {
                    $rootScope.authMsg=data.error;
            }
          })
          .error(function (data, status) {
            console.log(data,status);
            $rootScope.authMsg = data.message.toString();
          });
    }
  };
  $rootScope.stats = function () {
        var now = new Date();
        var yesterday = new Date();
        var yesterday = moment(yesterday).format("YYYY-MM-DD");
        var now = moment(now).format("YYYY-MM-DD");
        yesterday = startDateToUTC(yesterday);
        now = endDateToUTC(now);
        $http.post(MY_CONSTANT.url + '/dashboard_report', {
            access_token: localStorage.getItem('access_token'),
            start_time: yesterday,
            end_time: now
        }).success(function (data,status) {
            var data = data.data;
            $rootScope.ridesTotal = parseInt(data.total_data.rides);
            $rootScope.ridesToday = parseInt(data.specified_dates_data.rides);
            $rootScope.usersTotal = parseInt(data.total_users);
            $rootScope.usersToday = parseInt(data.total_users_registered_today);
            $rootScope.earningsTotal = parseInt(data.total_data.earnings);
            $rootScope.earningsToday = parseInt(data.specified_dates_data.earnings);
            $rootScope.scheduledRidesTotal= parseInt(data.total_scheduled_rides);
            $rootScope.scheduledRidesToday= parseInt(data.total_scheduled_rides_today);

        }).error(function (data,status) {

        })
  };
  // $rootScope.stats();
  $rootScope.logout = function(){
    console.log('loggin out');
    $rootScope.$auth=false;
    $rootScope.$pageFinishedLoading=true;
    $rootScope.showloader=false;
    console.log('removing');
    localStorage.removeItem('access_token');
    // window.history.pushState('',document.title,'index.html');
    $rootScope.authenticate();
  }
  $rootScope.regionList = function(a){
    $rootScope.regionList=['New York','Los Angeles','Boston','Chicago','Washington','New Jersey','Conneticut','North Carolina'];
    if(a){
      $rootScope.regionList.push(a);
    }
  }
  $rootScope.regionList();
}
angular.module('BlurAdmin').directive('googleplace', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, model) {
      var options = {
        types: ['geocode'],
        componentRestrictions: {}
      };
      scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

      google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
        scope.$apply(function() {
          model.$setViewValue(element.val());
        });
      });
    }
  };
});
angular.module('BlurAdmin').directive('fancybox', function ($templateRequest, $compile) {
    return {
        scope: true,
        restrict: 'A',
        controller: function($scope) {
            $scope.openFancybox = function (url,imageURL) {
                $scope.imageURL=imageURL;
                $templateRequest(url).then(function(html){
                    var template = $compile(html)($scope);
                    // $.fancybox.center();
                    $.fancybox.open({ content: template, type: 'html','autoScale':true,'overlayShow':true,'hideOnOverlayClick':true });
                });
            };
        },
        link: function link(scope, elem, attrs) {
            elem.bind('click', function() {
                var url = attrs.fancyboxTemplate;
                var imageURL = attrs.fancyboxImage;
                scope.openFancybox(url,imageURL);
            });
        },
    }
});
angular.module('BlurAdmin').directive('toggleFullscreen', function () {
    'use strict';

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            element.on('click', function (e) {
                e.preventDefault();

                if (screenfull.enabled) {
                    screenfull.toggle();

                    // Switch icon indicator
                    if (screenfull.isFullscreen)
                    {
                        // $(this).removeClass('fa-expand').addClass('fa-compress');
                        // $(this).removeClass('fa-expand').addClass('fa-compress');
                        document.getElementById("fl").innerHTML="fullscreen_exit";
                        console.log("Full");
                    }
                        
                    else
                    {
                        // $(this).removeClass('fa-compress').addClass('fa-expand');
                         document.getElementById("fl").innerHTML="fullscreen";
                        console.log("!Full");
                    }

                } else {
                    $.error('Fullscreen not enabled');
                }

            });
        }
    };

});
angular.module('BlurAdmin').constant("MY_CONSTANT", {

  "url":"http://54.148.113.16:3007",//Taxi Live Server
  // "url":"http://52.36.135.147:3007",//Taxi Test Server
  // "url_booking":"http://52.36.135.147:3001"    //Taxi server
});
angular.module('BlurAdmin').constant("MapLatLong", {
  "lat": 57.1910499,
  "lng": -2.0834466
});
angular.module('BlurAdmin').service('promoService', function() {
  var promo_id = '' ;

  var add_promo_id = function(id) {
    promo_id = id;
  };

  var get_promo_id = function(){
    return promo_id;
  };

  return {
    add_promo_id: add_promo_id,
    get_promo_id: get_promo_id
  };

});




angular.module('BlurAdmin').config(function(toastrConfig) {
  angular.extend(toastrConfig, {
    allowHtml: false,
    closeButton: false,
    closeHtml: '<button>&times;</button>',
    extendedTimeOut: 1000,
    iconClasses: {
      error: 'toast-error',
      info: 'toast-info',
      success: 'toast-success',
      warning: 'toast-warning'
    },  
    messageClass: 'toast-message',
    onHidden: null,
    onShown: null,
    onTap: null,
    progressBar: false,
    positionClass: 'toast-bottom-right',
    tapToDismiss: true,
    templates: {
	  toast: 'directives/toast/toast.html',
	  progressbar: 'directives/progressbar/progressbar.html'
	},
    timeOut: 5000,
    titleClass: 'toast-title',
    toastClass: 'toast'
  });
});
