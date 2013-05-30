var data = angular.module('data', []);

data.factory('population', function($http) {
  // Data from socrata
  var api_url = "http://opendata.socrata.com/resource/z9hk-ceyb.json";

  // The population object
  var population = {
    // Get a certain year's population data
    year: function(year) {
      for (var d in population.data) {
        var datapoint = population.data[d];
        if (datapoint.year == year)
          return datapoint;
      }
    },

    // The population based on
    // a projection of the annual growth rate
    current: function() {
      if (population.data === undefined)
        return new Qty("1 people");

      // The current date/time
      var now = new Date();
      // Which year is it?
      var thisYear = now.getFullYear();
      // The amount of the year that has past
      var millisPast = now - new Date(''+thisYear);
      var yearPast = millisPast / (new Date(''+(thisYear+1)) - new Date(''+thisYear));
      // Population data for this year
      var pop_data = population.year(thisYear);
      // The current estimated population
      var pop_now = parseInt(pop_data.population + pop_data.avg_annual_pop_change*yearPast);

      return new Qty(pop_now + "people");
    }
  };
  
  // Retrieve the population data
  $http.get(api_url)
    .success(function(data) {
      // Format the data
      angular.forEach(data, function(datapoint) {
        angular.forEach(datapoint, function(value, key) {
          if (key == "avg_annual_growth")
            datapoint[key] = parseFloat(value)
          else
            datapoint[key] = parseInt(value);
        });
      });
      // Add the data
      population.data = data;
    });

  return population;
});

data.factory('autoupdate', function($timeout) {
  var update = function() { $timeout(update, 100, true); };
  return update;
});

data.filter('unit', function() {
  return function(quantity, unit) {
    if (quantity !== undefined)
      return quantity.toString(unit);
  };
});

