'use strict';

var dmApp = angular.module('dmApp')

String.prototype.firstUpperCase=function(){
    return this.replace(/^\S/,function(s){return s.toUpperCase();});
}

dmApp.controller('SummaryCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.$on('jobDetail', function(event, data) {
        $scope.job = data;
        //var job = $scope.job;
        //$scope.mytime = job.batchJobModel.scheduleTime;
        //$scope.dt = job.batchJobModel.scheduleDate;
        //$scope.options.scheduleStatus = job.batchJobModel.scheduleStatus;
    });

    $scope.$watch('job', function() {
        $scope.$emit('saveJob', $scope.job);
    })

    $scope.today = function() {
        $scope.job.batchJobModel.scheduleDate = new Date();
    };
    //$scope.today();

    $scope.open = function($event) {
        $scope.status.opened = true;
    };

    //$scope.setDate = function(year, month, day) {
    //    $scope.dt = new Date(year, month, day);
    //};

    $scope.dateOptions = {
        //formatYear: 'yy',
        //startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.status = {
        opened: false
    };
    //var tomorrow = new Date();
    //tomorrow.setDate(tomorrow.getDate() + 1);
    //var afterTomorrow = new Date();
    //afterTomorrow.setDate(tomorrow.getDate() + 2);
    //$scope.events =
    //    [
    //        {
    //            date: tomorrow,
    //            status: 'full'
    //        },
    //        {
    //            date: afterTomorrow,
    //            status: 'partially'
    //        }
    //    ];

    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.ismeridian = true;
    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };
    $scope.options = {
        status: ['', 'On Hold', 'Active']
    };

}]);

