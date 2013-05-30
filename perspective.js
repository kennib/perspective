var persp = angular.module('perspective', ['data']);

persp.config(function($routeProvider) {
  $routeProvider
    .when('/', {controller: 'homeCtrl', templateUrl: 'home.html'})
    .when('/:idea/:slide', {
      controller: 'ideaCtrl',
      templateUrl: 'idea.html'
    })
    .when('/:idea', {redirectTo: '/:idea/0'})
    .otherwise({redirectTo: '/'});
});

persp.controller('homeCtrl', function($scope) {
});

persp.controller('ideaCtrl', function($scope, $routeParams, $controller) {
  $scope.idea = $routeParams.idea;
  $scope.slide = $routeParams.slide;
  $scope.slideURL = $routeParams.idea + '/slide' + $routeParams.slide + '.html';
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
