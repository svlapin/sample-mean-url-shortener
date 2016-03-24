(function(angular) {
  'use strict';

  angular.module('UrlShortener')

    .controller('MainController', function($scope, $http, $window) {

      var init = function() {
        $scope.state = {};

        $scope.state.originalUrl = '';
        $scope.state.desiredUrl = '';
        $scope.state.checkMessage = '';
        $scope.state.result = '';
      };

      init();

      $scope.checkIfAlreadyTaken = function() {
        $http.get('/api/check-if-taken',
          {params: {url: $scope.state.desiredUrl}})
        .then(function(resp) {
          if (resp.data.result === 'ALREADY_EXISTS') {
            $scope.state.checkMessage = 'Already taken';
          } else {
            $scope.state.checkMessage = 'Available';
          }
        });
      };

      $scope.submit = function() {
        if (!$scope.state.originalUrl) return;
        $http.post('/api/generate',
          {
            originalUrl: $scope.state.originalUrl,
            desiredUrl: $scope.state.desiredUrl
          })
        .then(function(resp) {
          $scope.state.result = window.location.href +
            resp.data.url;
        })
        .catch(function(resp) {
          if (resp.data.error) {
            $window.alert(resp.data.error);
          }
          init();
        });
      };
    });
})(angular);
