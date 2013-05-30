var persp = angular.module('perspective', ['data']);

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

persp.controller('populationCtrl', function($scope, $timeout, population, autoupdate) {
  window.scope = $scope;
  $scope.population = population;
  $scope.distanceToTheMoon = new Qty('367373 km');
  $scope.averagePerson = {
    depth: new Qty('0.5 metres'),
  };

  autoupdate();
});
