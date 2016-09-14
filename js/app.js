angular.module('vicEmergency', [])
  .controller('VicEmergencyController', ['$http', function VicEmergencyController($http) {
    var self = this;
    self.emergencies = [];
    $http
      .jsonp('https://data.emergency.vic.gov.au/Show?pageId=getIncidentJSON&callback=JSON_CALLBACK')
      .then(function(response) {
        self.emergencies = response.data.results;
      });
  }]);
