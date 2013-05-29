var persp = angular.module('perspective', []);

persp.config(function($routeProvider) {
  $routeProvider
    .when('/', {controller: 'homeCtrl', templateUrl: 'home.html'})
    .when('/:idea/:slide', {
      controller: 'ideaCtrl',
      templateUrl: function(params) {
        return params.idea + '/slide' + params.slide + '.html';
      }
    })
    .when('/:idea', {redirectTo: '/:idea/0'})
    .otherwise({redirectTo: '/'});
});

persp.controller('homeCtrl', function($scope) {
});

persp.controller('ideaCtrl', function($scope, $routeParams, $controller, $parse) {
  $scope.idea = $routeParams.idea;
  $scope.slide = $routeParams.slide;
  $controller($scope.idea+'Ctrl', {$scope: $scope});
});

persp.controller('populationCtrl', function($scope) {
  $scope.population = 7142893234; // people
  $scope.distanceToTheMoon = 367373000; // metres
  $scope.averagePerson = {
    depth: 0.5, // metres
  };
});
