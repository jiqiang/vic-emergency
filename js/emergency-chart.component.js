angular.module('vicEmergency').component('emergencyChart', {
  template: '<div id="emergency-chart"></div>',
  controller: function EmergencyChartController() {
    var self = this;

    var chart = Highcharts.chart('emergency-chart', {
      chart: {
        type: 'spline'
      },
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
        formatter: function() {
          return this.y + ' incident(s) @ ' + this.x;
        }
      },
      plotOptions: {
        spline: {
          marker: { enabled: false },
          events: {
            click: function(e) {
              console.log(e.point.index);
            }
          }
        }
      },
      series: [{ data: [] }],
      legend: { enabled: false }
    });

    self.$onChanges = function(changesObj) {
      chart.series[0].setData(changesObj.data.currentValue.y, true);
      chart.xAxis[0].setCategories(changesObj.data.currentValue.x, true);
    };
  },
  bindings: {
    data: '<'
  }

});
