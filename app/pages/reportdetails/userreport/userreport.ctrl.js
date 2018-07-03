/* Copyrights-Developed by Taxi Technologies INC. */
(function() {
  "use strict";

  angular
    .module("BlurAdmin.pages.reportdetails.userreport")
    .controller("userreportCtrl", userreportCtrl);

  function userreportCtrl(
    $timeout,
    $scope,
    $http,
    MY_CONSTANT,
    ngDialog,
    $state,
    $filter,
    $rootScope,
    $mdSidenav,
    $log
  ) {
    // console.log('userreportCtrluserreportCtrluserreportCtrl', MY_CONSTANT.url+ '/user_list');

    $scope.isLoading = false;

    $scope.users = [];
    $scope.viewbyUser = 10;
    $scope.totalUserItems = 0; //$scope.data.length; //
    $scope.currentPageUser = 1; //
    $scope.itemsPerPageUser = $scope.viewbyUser; //
    $scope.maxSizeUser = 5; //Number of pager buttons to show

    $scope.drivers = [];
    $scope.viewbyDriver = $scope.viewbyUser;
    $scope.totalDriverItems = 0; //$scope.data.length; //
    $scope.currentPageDriver = 1; //
    $scope.itemsPerPageDriver = $scope.viewbyDriver; //
    $scope.maxSizeDriver = 5; //Number of pager buttons to show

    $scope.options = {
      rowSelection: false,
      multiSelect: true,
      autoSelect: true,
      decapitate: false,
      largeEditDialog: true,
      boundaryLinks: true,
      limitSelect: false,
      pageSelect: false
    };

    $scope.p_query = {
      filter: "",
      order: "user_id",
      limit: 10,
      page: 1
    };

    $scope.d_query = {
      filter: "",
      order: "driver_id",
      limit: 10,
      page: 1
    };

    $scope.selected = [];
    $scope.limitOptions = [10, 15, 30];

    $scope.getUserPage = function() {
      $scope.isLoading = true;

      var skipUser = ($scope.currentPageUser - 1) * $scope.viewbyUser;

      $http
        .post(MY_CONSTANT.url + "/user_list", {
          access_token: localStorage.getItem("access_token"),
          limit: $scope.viewbyUser,
          offset: skipUser,
          searchFlag: 0,
          searchString: "",
          sort_by: "date_registered",
          sort_order: "DESC"
        })
        .success(function(data, status) {
          $scope.isLoading = false;

          //console.log('datadatadata', data);

          $scope.users = data.users.filter(user => {
            var canceled_rides = parseInt(user.total_cancel);
            var total_rides = parseInt(user.total_rides);
            var completedRides = total_rides - canceled_rides;
            var cancelPer = canceled_rides / total_rides * 100;
            var completePer = completedRides / total_rides * 100;

            user.cancelPer = cancelPer;
            user.completePer = completePer;
          });

          $scope.users = data.users;
          $scope.totalUserItems = data.total_users;
        })
        .error(function(data, status) {});
    };

    $scope.getUserPage();

    $scope.setPage = function(pageNo) {
      $scope.currentPageUser = pageNo;
    };

    $scope.pageChangedUser = function() {
      //console.log('Page changed to: ' + $scope.currentPageUser);
      $scope.getUserPage();
    };

    $scope.setItemsPerPage = function(num) {
      $scope.itemsPerPageUser = num;
      $scope.currentPageUser = 1; //reset to first page
    };

    $scope.getDriverPage = function() {
      $scope.isLoading = true;

      var skipDriver = ($scope.currentPageDriver - 1) * $scope.viewbyDriver;

      $http
        .post(MY_CONSTANT.url + "/admin/drivers_by_type", {
          access_token: localStorage.getItem("access_token"),
          limit: $scope.viewbyDriver,
          offset: skipDriver,
          searchFlag: 0,
          searchString: "",
          requestType: 3
        })
        .success(function(data, status) {
          $scope.isLoading = false;

          //console.log('datadatadata', data);

          $scope.drivers = data.drivers.filter(driver => {
            var canceled_rides = parseInt(driver.total_cancel);
            var total_rides = parseInt(driver.total_rides);
            var completedRides = total_rides - canceled_rides;
            var cancelPer = canceled_rides / total_rides * 100;
            var completePer = completedRides / total_rides * 100;

            driver.cancelPer = cancelPer;
            driver.completePer = completePer;
          });

          $scope.drivers = data.drivers;
          $scope.totalDriverItems = data.total_drivers;
        })
        .error(function(data, status) {});
    };

    $scope.getDriverPage();

    $scope.setPageDriver = function(pageNo) {
      $scope.currentPageDriver = pageNo;
    };

    $scope.pageChangedDriver = function() {
      //console.log('Page changed to: ' + $scope.currentPageDriver);
      $scope.getDriverPage();
    };

    $scope.setItemsPerPage = function(num) {
      $scope.itemsPerPageDriver = num;
      $scope.currentPageDriver = 1; //reset to first page
    };

    $scope.back = function() {
      $state.go("reports");
    };

    function downloadCSV(csv, filename) {
      var csvFile;
      var downloadLink;

      // CSV file
      csvFile = new Blob([csv], { type: "text/csv" });

      // Download link
      downloadLink = document.createElement("a");

      // File name
      downloadLink.download = filename;

      // Create a link to the file
      downloadLink.href = window.URL.createObjectURL(csvFile);

      // Hide download link
      downloadLink.style.display = "none";

      // Add the link to DOM
      document.body.appendChild(downloadLink);

      // Click download link
      downloadLink.click();
    }

    $scope.exportTableToCSV = function(filename, selector) {
      var csv = [];
      var rows = document.querySelectorAll(selector);

      for (var i = 0; i < rows.length; i++) {
        var row = [],
          cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);

        csv.push(row.join(","));
      }

      // Download CSV file
      downloadCSV(csv.join("\n"), filename);
    };
  }
})();
