/* Copyrights-Developed by Qudos Technologies INC. */
(function() {
  "use strict";
  angular
    .module("BlurAdmin.pages.drivers.complete")
    .controller("completeCtrl", completedCtrl);

  function completedCtrl(
    $timeout,
    $rootScope,
    $scope,
    $http,
    MY_CONSTANT,
    ngDialog,
    $state,
    $filter,
    $mdSidenav,
    $log
  ) {
    var bookmark;
    $scope.delete_passenger_id = "";
    $scope.displaymsg = "";
    $scope.driverpass = {};
    $rootScope.showloader = true;
    $scope.isLoading = false;
    $scope.totalItems = 0;
    $scope.viewby = 10;
    $scope.totalItems = 0; //$scope.data.length; //
    $scope.currentPage = 1; //
    $scope.itemsPerPage = $scope.viewby; //
    $scope.maxSize = 5; //Number of pager buttons to show

    $scope.pageChanged = function() {
      $scope.get_rides_by_type();
    };

    /*----------------------- funtion to MD-Data Table -------------------*/
    ("use strict");
    $scope.selected = [];
    $scope.limitOptions = [10, 15, 30];
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
    $scope.query = {
      filter: "",
      order: "date_registered",
      limit: 10,
      page: 1
    };
    $scope.filter = {
      options: {
        debounce: 500
      }
    };
    $scope.removeFilter = function() {
      $scope.filter.show = false;
      $scope.query.filter = "";
    };
    $scope.get_rides_by_type = function() {
      var skip = ($scope.currentPage - 1) * $scope.viewby;
      $scope.isLoading = true;
      $http({
        url: MY_CONSTANT.url + "/admin/get_rides_by_type",
        method: "POST",
        header: {
          "Content-Type": "application/json;"
        },
        data: {
          access_token: localStorage.getItem("access_token"),
          limit: $scope.viewby,
          offset: skip,
          requestType: 2,
          searchFlag: $scope.query.filter ? 1 : 0,
          searchString: $scope.query.filter,
          sort_order: "DESC",
          test: 333
        }
      })
        .success(function(data, status) {
          var arr = [];
          $scope.totalItems = data.total_rides;
          $scope.desserts = {
            count: data.total_rides,
            data: data.rides
          };
          $scope.isLoading = false;
          $rootScope.showloader = false;
        })
        .error(function(data, status) {});
    };
    $scope.get_rides_by_type();
    $scope.$watch("query.filter", function(newValue, oldValue) {
      if (!oldValue) {
        bookmark = $scope.query.page;
      }
      if (newValue !== oldValue) {
        $scope.query.page = 1;
      }
      if (!newValue) {
        $scope.query.page = bookmark;
      }
      $scope.get_rides_by_type();
    });

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

    $scope.exportTableToCSV = function(filename) {
      var csv = [];
      var rows = document.querySelectorAll("#completed tr");

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
