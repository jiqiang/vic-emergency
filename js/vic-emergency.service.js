angular.module('vicEmergency')

.factory('utils', ['$http', function($http) {

  function fetch() {
    return $http.jsonp('https://data.emergency.vic.gov.au/Show?pageId=getIncidentJSON&callback=JSON_CALLBACK');
  }

  /**
   * Shuffles array in place.
   * @param {Array} a items The array containing the items.
   */
  function shuffle(anarray) {
    var a, j, x, i;
    a = angular.copy(anarray);
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
    return a;
  }

  function random(min, max) {
    return Math.floor((Math.random() * max) + min);
  }

  function dailyTimeSeries() {
    var hour, minute, timeSeries = [];
    for (var i = 0; i < 24; i++) {
      hour = i < 10 ? '0' + i : i;
      for (var j = 0; j < 6; j++) {
        minute = j < 10 ? j + '0' : j;
        timeSeries.push(hour + ':' + minute);
      }
    }
    return timeSeries;
  }

  function makeChartData(x, y) {
    var chartData = [];
    for (var i = 0; i < x.length; i++) {
      chartData.push(y[i].length);
    }
    return {
      x: x,
      y: chartData
    };
  }

  return {
    fetch: fetch,
    shuffle: shuffle,
    random: random,
    dailyTimeSeries: dailyTimeSeries,
    makeChartData: makeChartData
  };

}]);
