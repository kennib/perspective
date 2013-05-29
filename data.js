var data = angular.module('data', []);

data.filter('unit', function() {
  return function(quantity, unit) {
    return quantity.toString(unit);
  };
});

