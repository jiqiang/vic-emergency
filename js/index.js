var map,
    baseLayer,
    emergencyLayer,
    source,
    view,
    feature,
    polygon,
    size,
    style,
    emergencyFeature;

style = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(255, 255, 255, 0)'
  }),
  stroke: new ol.style.Stroke({
    color: 'rgba(255, 255, 255, 0)'
  }),
  image: new ol.style.Circle({
    radius: 5,
    fill: new ol.style.Fill({
      color: 'rgba(255, 0, 0, 1)'
    }),
    stroke: new ol.style.Stroke({
      color: '#319FD3',
      width: 1
    })
  })
});

source = new ol.source.Vector({
  url: '/data/vic.json',
  format: new ol.format.GeoJSON()
});

baseLayer = new ol.layer.Tile({
  source: new ol.source.OSM()
});

emergencyLayer = new ol.layer.Vector({
  source: source,
  style: style
});

view = new ol.View({
  center: [0, 0],
  zoom: 1
});

map = new ol.Map({
  target: 'vic-emergency-map',
  layers: [baseLayer, emergencyLayer],
  view: view,
  controls: ol.control.defaults({
    attributionOptions: {
      collapsible: false
    }
  })
});

size = map.getSize();

source.once('addfeature', function(e) {
  polygon = e.feature.getGeometry()
  view.fit(polygon, size, {constrainResolution: false});
});

window.addEventListener('resize', function() {

})

function getEmergencyFeature(emergency) {
  return new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.transform([emergency.longitude, emergency.latitude], 'EPSG:4326', 'EPSG:3857'))
  });
}

function onIncidentJSONLoaded(response) {
  features = response.results.map(function(item) {
    return getEmergencyFeature(item);
  });
  source.clear();
  source.addFeatures(features);
  $('#app').html((new Date()).toTimeString());
}

(function fetch() {
  $.ajax({
    url: 'https://data.emergency.vic.gov.au/Show?pageId=getIncidentJSON',
    method: 'GET',
    cache: false,
    dataType: 'jsonp',
    jsonpCallback: 'onIncidentJSONLoaded',
    complete: setTimeout(function() {fetch()}, 15000),
    timeout: 3000
  });
})();
