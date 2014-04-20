'use strict';

angular.module('cync.controllers', [])
    .controller('cyncController', function ($scope, $http, $log, socket) {
        
        $scope.msgs = [];
        
        socket.on('message:new', function (message) {
            $log.info(message);
            $scope.msgs.push(message);
        });

        // socket.on('order:update', function (order) {
        //     //update
        // });

        $scope.$on('$destroy', function (event) {
            socket.removeAllListeners();
            // or something like
            // socket.removeListener(this);
        });

        // at the bottom of your controller
  });