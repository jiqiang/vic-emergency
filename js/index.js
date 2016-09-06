var map,
    mapEl = document.getElementById('vic-emergency-map'),
    mapWidth = mapEl.offsetWidth;

function initMap() {
  mapEl.style.height = mapWidth / 1.618 + "px";
  map = new google.maps.Map(mapEl, {
    center: {lat: -36.4251149, lng: 145.0603821},
    zoom: 7,
    mapTypeControl: false,
    streetViewControl: false
  });
}

window.addEventListener('resize', function() {
  mapWidth = mapEl.offsetWidth;
  mapEl.style.height = mapWidth / 1.618 + "px";
})
