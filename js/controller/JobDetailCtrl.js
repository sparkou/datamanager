'use strict';

var dmApp = angular.module('dmApp')

String.prototype.firstUpperCase=function(){
    return this.replace(/^\S/,function(s){return s.toUpperCase();});
}

dmApp.controller('JobDetailCtrl', ['$scope', '$stateParams', '$state', 'DataManagerService', '$uibModal', function($scope, $stateParams, $state, DataManagerService, $uibModal) {

    if($stateParams.key == 'summary') {
        return $state.go('job.summary',{jobName: $stateParams.jobName})
    }else if($stateParams.key == 'aca') {
        return $state.go('job.aca', {jobName: $stateParams.jobName})
    }

    var feature = $stateParams.key;
    var jobType = $stateParams.type;
    var colTyp = '';
    if(feature == 'record') {
        colTyp = 'RecordType';
    }else if(feature == 'addrType') {
        colTyp = 'AddrType';
    }

    DataManagerService.getColDef().then(function(data) {
        $scope.cols = data[colTyp];
    });
    DataManagerService.getAll(feature, jobType).then(function(data) {
        $scope.allrows = data.result;
    });
    $scope.$watch('allrows', function() {
        if(!angular.isUndefined($scope.allrows)) {
            $scope.totalItems = $scope.allrows.length;
            $scope.rows = $scope.allrows.slice(0, 10);
        }
    });
    $scope.currentPage = 1;
    $scope.maxSize = 10;
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.pageChanged = function() {
        $scope.rows = $scope.allrows.slice($scope.currentPage * 10 - 10, $scope.currentPage * 10);
    };

    $scope.showConflict = function(size) {
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'partials/conflict.html',
            controller: 'ConflictModalCtrl',
            //windowClass: 'app-modal-window',
            size: size,
            resolve: {

            }
        });
        modalInstance.result.then(function () {
            //$scope.type = type;
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.$watch('rows', function() {
        $scope.$emit('saveData', $scope.rows);
    })

    $scope.save = function() {
        console.log($scope.rows)

    }
}]);

