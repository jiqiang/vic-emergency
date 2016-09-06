var map,
    mapEl = document.getElementById('vic-emergency-map'),
    mapWidth = mapEl.offsetWidth,
    markers = [];

function initMap() {
  mapEl.style.height = mapWidth / 1.618 + "px";
  map = new google.maps.Map(mapEl, {
    center: {lat: -36.4251149, lng: 145.0603821},
    zoom: 7,
    mapTypeControl: false,
    streetViewControl: false
  });
}

function dropMakers(map, emergency, index) {

  setTimeout(function() {
    var marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: {lat: emergency.latitude, lng: emergency.longitude}
    });
    markers.push(marker);
  }, index * 200);

}

window.addEventListener('resize', function() {
  mapWidth = mapEl.offsetWidth;
  mapEl.style.height = mapWidth / 1.618 + "px";
})

$.ajax({
  url: 'https://data.emergency.vic.gov.au/Show?pageId=getIncidentJSON',
  method: 'GET',
  cache: false,
  dataType: 'json'
})
.done(function(response) {
  emergencies = response.results.map(function(item, index) {
    dropMakers(map, item, index);
  });
});
