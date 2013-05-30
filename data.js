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

data.value("distances", {
  "distance to the Moon": new Qty('367373 km'),
  "circumference of the Earth": new Qty('40075.04 km'),
  "distance from Sydney to Melbourne": new Qty('713.8 km'),
  "length of the Sydney Harbour Bridge": new Qty('1149 m'),
  "length of the Nile River": new Qty('6650 km'),
  "length of the Great Wall of China": new Qty('21196 km'),
});

data.value("areas", {
  "area of the Moon visible from Earth": new Qty('37900000 km2'),
  "area of the United States of America": new Qty('9631000 km2'),
  "area of Australia": new Qty('7687000 km2'),
  "area of the UK": new Qty('243610 km2'),
  "area of New York City": new Qty('783.8 km2'),
  "area of Vatican City": new Qty('0.44 km2'),
  "size of a Football (NFL) field": new Qty('5351 m2'),
  "maximum size of a Football (FIFA) field": new Qty('10800 m2'),
  "size of a Basketball court": new Qty('436.6 m2'),
});

data.factory('autoupdate', function($timeout) {
  var update = function() { $timeout(update, 100, true); };
  return update;
});

data.filter('unit', function() {
  return function(quantity, unit, sigFigs) {
    if (quantity !== undefined)
      return quantity.toString(unit, sigFigs);
  };
});

data.filter('range', function() {
  return function(start, end) {
    if (end === undefined) {
      end = start;
      start = 0;
    }

    var range = [];
    for (var i=start; i<end; i++)
      range.push(i);

    return range;
  }
});

data.directive('quantityDiagram', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      // Create a canvas
      var canvas = document.createElement("canvas");
      var context = canvas.getContext('2d');

      scope.$watch(attrs["image"], function(imageName) {
        // The number of images that need to be fit on the canvas
        var numImages = scope.$eval(attrs["number"]);

        // Add the images
        var image = new Image();
        image.onload = function() {
          // Calculate the scale of the image
          var vertical = canvas.offsetHeight/image.height;
          var horizontal = canvas.offsetWidth/image.width;
          var size = Math.sqrt(vertical*horizontal/numImages);
          // Recalculate scale to fit images in without cutting them off
          var rows = Math.ceil(canvas.offsetHeight/(image.height*size));
          size = canvas.offsetHeight/rows/image.height;
          image.height *= size; image.width *= size;

          // Place images
          var i = 0;
          for (var y=0; y<canvas.offsetHeight; y+=image.height) {
            for (var x=0; x<canvas.offsetWidth; x+=image.width) {
              if (i++ < numImages)
              context.drawImage(image, x, y, image.width, image.height);
            }
          }
        };
        
        // Get the image
        image.src = "images/"+imageName+".jpg";
      });

      // Add the canvas to the element
      element.append(canvas);
      canvas.width = element[0].offsetWidth;
    }
  }
});

