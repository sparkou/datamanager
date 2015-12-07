'use strict';

var dmApp = angular.module('dmApp')

String.prototype.firstUpperCase=function(){
    return this.replace(/^\S/,function(s){return s.toUpperCase();});
}

dmApp.controller('JobModalCtrl', function ($scope, $uibModalInstance, type) {

    type = type.firstUpperCase();
    $scope.translationData = {
        jobType: type,
        value: 'Name'
    };
    $scope.createJob = function () {
        $uibModalInstance.close($scope.job);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

dmApp.controller('ScheduleModalCtrl', function ($scope, $uibModalInstance, job) {

    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.open = function($event) {
        $scope.status.opened = true;
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.status = {
        opened: false
    };

    $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.ismeridian = true;
    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };
    $scope.options = {
        scheduleStatus: 'On Hold',
        status: ['On Hold', 'Active']
    };

    $scope.schedule = function () {

        job.batchJobModel.scheduleDate = $scope.dt;
        job.batchJobModel.scheduleTime = $scope.mytime;
        job.batchJobModel.scheduleStatus = $scope.options.scheduleStatus;
        $uibModalInstance.close(job);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

dmApp.controller('ConflictModalCtrl', function ($scope, $uibModalInstance) {

    //type = type.firstUpperCase();
    $scope.translationData = {
        //jobType: type,
        //value: 'Name'
    };
    $scope.createJob = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});


