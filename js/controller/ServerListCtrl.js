'use strict';

var dmApp = angular.module('dmApp')

String.prototype.firstUpperCase=function(){
    return this.replace(/^\S/,function(s){return s.toUpperCase();});
}

dmApp.controller('ServerListCtrl', ['$scope', '$stateParams', 'DataManagerService', '$resource', '$uibModal', '$log', '$rootScope', '$timeout', '$state', function($scope, $stateParams, DataManagerService, $resource, $uibModal, $log, $rootScope, $timeout, $state) {

    $scope.servers = [
        {"name": "AzureQA", "agency": "PETALUMA", "status": "Active"},
        {"name": "AzureQA", "agency": "FLAGSTAFF", "status": "Active"},
        {"name": "AzureQA", "agency": "BPTDEV", "status": "Active"}
    ]

    $scope.showExportHistory = function(server, agency) {
        console.log("Server: " + server + " Agency: " + agency);
        $state.go('export', {server: server, agency: agency, type: 'export'});
    }

    //DataManagerService.getJobs(type).then(function(data) {
    //    $scope.jobs = data;
    //
    //});

    $scope.currentPage = 1;

    //$scope.type = $stateParams.type;
    //$scope.isopen = false;

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.isopen = !$scope.isopen;
    };
    $scope.maxSize = 10;
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
        $scope.jobs = $scope.alljobs.slice($scope.currentPage * 10 - 10, $scope.currentPage * 10);
    };
    $scope.pageChanged = function() {
        $scope.jobs = $scope.alljobs.slice($scope.currentPage * 10 - 10, $scope.currentPage * 10);
    };

    //$scope.translationData = {
    //    jobType: type
    //};
    //
    $scope.newServer = function() {
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'partials/newServer.html',
            controller: 'ServerModalCtrl',
            //size: size,
            resolve: {

            }
        });
        modalInstance.result.then(function (data) {
            $scope.servers.push(data);
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    //$scope.compare = function(size,job) {
    //    var modalInstance = $uibModal.open({
    //        animation: false,
    //        templateUrl: 'partials/schedule.html',
    //        controller: 'ScheduleModalCtrl',
    //        windowClass: 'app-modal-window',
    //        resolve: {
    //            job: job
    //        }
    //    });
    //    modalInstance.result.then(function () {
    //        $scope.job = job;
    //    }, function () {
    //        //$log.info('Modal dismissed at: ' + new Date());
    //    });
    //    //console.log($scope.jobs);
    //};
    //
    //$scope.jobDetail = function(job) {
    //    $timeout(function() {
    //        $rootScope.$broadcast('jobDetail', job);
    //    }, 100)
    //};

}]);

