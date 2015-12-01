/**
 * Created by ouspark on 11/22/15.
 */

"use strict"

var dmApp = angular.module('dmApp')

dmApp.factory('apiService', apiService);

function apiService($resource, $location, $window, $http) {
    var serverhost = '';
    var service = {
      Test: function(param) {
          var url = '';
          if(param == 'Export') {
              url = '/datamanager/data/exportJob.json';
          }else if(param == 'Import') {
              url = '/datamanager/data/importJob.json';
          }else if(param == 'Delete') {
              url = '/datamanager/data/deleteJob.json';
          }
          this.api = {
              GetUrl: "/datamanager/data/exportJob.json",
              GetsUrl: url,
              CreateUrl: "",
              UpdateUrl: "",
              DeleteUrl: ""
          }
          execRequest.call(this);
      }
    };

    var execRequest = function () {
        this.Get = function (requestParams, successFunc, errorFunc) {
            var url = serverhost + this.api.GetUrl;
            $resource(url).get(requestParams, function (data) {
                errorHandler(data, successFunc, errorFunc)
            }, errorFunc);
        }

        this.Gets = function (requestParams, successFunc, errorFunc) {
            var url = serverhost + this.api.GetsUrl;
            $resource(url, {}, {gets: {method: "GET", isArray: true}}).gets(requestParams, function (data) {
                errorHandler(data, successFunc, errorFunc)
            }, errorFunc);
         }

        this.Create = function (requestParams, requestBody, successFunc, errorFunc) {
            var url = serverhost + this.api.CreateUrl;
            var request = $resource(url, {}, {saveData: {method: "POST"}});
            request.saveData(requestParams, requestBody, function (d) {
                errorHandler(d, successFunc, errorFunc);
            }, errorFunc);
        }

        this.Update = function (requestParams, requestBody, successFunc, errorFunc) {
            var url = serverhost + this.api.UpdateUrl;
            var request = $resource(url, {}, {saveData: {method: "PUT"}});
            request.saveData(requestParams, requestBody, function (d) {
                errorHandler(d, successFunc, errorFunc);
            }, errorFunc);
        }

        this.Delete = function (requestParams, successFunc, errorFunc) {
            var url = serverhost + this.api.DeleteUrl;
            var request = $resource(url, {}, {saveData: {method: "DELETE"}});
            request.saveData(requestParams, function (d) {
                errorHandler(d, successFunc, errorFunc);
            }, errorFunc);
        }
        var errorHandler = function (d, callback, errorCallback) {
            switch (d.status) {
                case 200:
                    callback(d);
                    break;
                case 400:
                case 403:
                case 404:
                case 500:
                    if (errorCallback instanceof Function)
                        errorCallback(d);
                    throw "server internal error " + d;
                    break;
                case 401:
                    break;
                default:
                    callback(d);
                    break;
            }
        }
    };

    return service;
}





