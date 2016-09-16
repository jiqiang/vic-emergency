angular.module('vicEmergency', [])
  .controller('VicEmergencyController', ['$http', 'utils', function VicEmergencyController($http, utils) {

    var self = this;
    self.emergencies = [];
    self.dailyData = [];
    self.chartData = { x:[], y:[] };

    utils.fetch().then(function(response) {
      var items = response.data.results;

      var timeSeries = utils.dailyTimeSeries();

      for (var i = 0; i < timeSeries.length; i++) {
        var shuffledItems = utils.shuffle(items);
        var newItems = shuffledItems.slice(0, utils.random(1, shuffledItems.length));
        self.dailyData.push(newItems);
      }

      self.chartData = utils.makeChartData(timeSeries, self.dailyData);
    });
  }]);
