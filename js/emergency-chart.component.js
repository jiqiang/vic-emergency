angular.module('vicEmergency').component('emergencyChart', {
  template: '<div id="emergency-chart"></div>',
  controller: function EmergencyChartController() {
    var self = this;

    var chart = Highcharts.chart('emergency-chart', {
      chart: { type: 'spline' },
      title: { text: 'Victoria Emergencies' },
      subtitle: { text: 'Incidents report at every 10 minutes' },
      xAxis: {
        title: { text: 'Time' }
      },
      yAxis: {
        title: { text: 'Number of Incidents' },
        min: 0
      },
      tooltip: {
        headerFormat: '',
        pointFormat: '{point.y}@{point.x}'
      },
      plotOptions: {
        spline: {
          marker: { enabled: true }
        }
      },
      series: [{ data: self.chartData }]
    });

    self.$onChanges = function(changesObj) {
      chart.series[0].setData(changesObj.data.currentValue, true);
    };
  },
  bindings: {
    data: '<'
  }

});
