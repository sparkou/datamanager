'use strict';

var dmApp = angular.module('dmApp')

dmApp.factory('DataManagerService', dmService);

function dmService($q, $http, apiService, $log) {


    function getJobs(param) {
        var testApi = new apiService.Test(param);
        var deferred = $q.defer();
        testApi.Gets(null, function (data) {
            if (data) {
                deferred.resolve(data);
            }
            else {
                deferred.resolve([]);
            }
        }, function (e) {
            deferred.resolve([]);
            $log.error(param + ' Job not found: ' + e)
        });
        return deferred.promise;
    }

    function getFeatures() {
        var deferred = $q.defer();
        $http.get('/datamanager/js/treeData.json').success(function(data) {
            return deferred.resolve(data);
        })
        return deferred.promise;
    }

    function getColDef() {
        var deferred = $q.defer();
        $http.get('/datamanager/js/colDef.json').success(function(data) {
            return deferred.resolve(data);
        })
        return deferred.promise;
    }


    function getAll(feature, jobType) {

        var obj = {"configModel": {"feature": feature, "jobType": jobType}};
        var api = new apiService.Api(obj);
        var deferred = $q.defer();
        //testApi.GetAll(null, obj, function (data) {
        api.Get(null, function (data) {
            if (data) {
                deferred.resolve(data);
            }
            else {
                deferred.resolve([]);
            }
        }, function (e) {
            deferred.resolve([]);
            $log.error(e)
        });
        return deferred.promise;

    }

    return {
        getJobs: getJobs,
        getFeatures: getFeatures,
        getAll: getAll,
        getColDef: getColDef
    };
}


