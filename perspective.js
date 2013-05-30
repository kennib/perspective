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

persp.controller('populationCtrl', function($scope, $timeout, population, distances, areas, autoupdate) {
  window.scope = $scope;
  $scope.population = population;

  $scope.distances = distances;
  $scope.distance = "distance to the Moon";
  $scope.averagePerson = {
    depth: new Qty('0.5 metres'),
  };

  $scope.areas = areas;
  $scope.area = "area of New York City";
  $scope.person_areas = {
    "the area of a newspaper": new Qty('0.126 m2'),
    "a square meter": new Qty('1 m2'),
    "the area of king size bed": new Qty('3.715 m2'), 
    "the average size of an Australian house": new Qty('227.6 m2'),
  };
  $scope.person_area = $scope.person_areas["a square meter"];

  autoupdate();
});
