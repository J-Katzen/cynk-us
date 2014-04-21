'use strict';

angular.module('cync.controllers', [])
    .controller('cyncController', function ($scope, $http, $log, socket) {

        $scope.msgs = [];

        $scope.newMessage = function() {

        };

        socket.on('message:new', function (message) {
            $log.info(message);
            $scope.msgs.push(message);
        });

        $scope.$on('$destroy', function (event) {
            socket.removeAllListeners();
            // or something like
            // socket.removeListener(this);
        });

        var sf_region = {
            southWest: {
                lat: 37.730,
                lng: -122.515
            },
            northEast: {
                lat: 37.8129,
                lng: -122.382
            }
        };

        angular.extend($scope, {
            maxbounds: sf_region,
            defaults: {
                tileLayer: "https://api.tiles.mapbox.com/v3/jkatzen.i19egpgn/{z}/{x}/{y}.png",
                minZoom: 13,
                maxZoom: 18
            }
        });

        // at the bottom of your controller
  });