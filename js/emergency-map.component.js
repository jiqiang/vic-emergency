angular.module('vicEmergency').component('emergencyMap', {
  template: '<div id="emergency-map"></div>',
  controller: function EmergencyMapController() {
    var self = this,
      map,
      baseLayer,
      emergencyLayer = undefined,
      source,
      view,
      feature,
      polygon,
      size,
      style,
      emergencyFeature,
      emergencyLayerSource = undefined,
      vicLayer,
      selectedEmergency = undefined,
      selectedEmergencyStyle;



    vicLayerStyle = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(255, 255, 255, 0)'
      })
    });

    emergencyLayerStyle = new ol.style.Style({
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

    selectedEmergencyStyle = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: 'blue'
        }),
        stroke: new ol.style.Stroke({
          color: '#319FD3',
          width: 1
        })
      })
    });

    baseLayer = new ol.layer.Tile({
      source: new ol.source.OSM()
    });

    vicLayerSource = new ol.source.Vector({
      url: 'data/vic.json',
      format: new ol.format.GeoJSON()
    });

    vicLayer = new ol.layer.Vector({
      source: vicLayerSource,
      style: vicLayerStyle
    });

    view = new ol.View({
      center: [0, 0],
      zoom: 1
    });

    map = new ol.Map({
      target: 'emergency-map',
      layers: [baseLayer, vicLayer],
      view: view,
      controls: ol.control.defaults({
        attributionOptions: ({
          collapsible: true
        })
      })
    });

    vicLayerSource.once('addfeature', function(e) {
      view.fit(e.feature.getGeometry(), map.getSize(), {constrainResolution: false});
    });

    function getEmergencyFeature(emergency) {
      return new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform([emergency.longitude, emergency.latitude], 'EPSG:4326', 'EPSG:3857')),
        incidentNo: emergency.incidentNo,
        incidentLocation: emergency.incidentLocation,
        incidentType: emergency.incidentType,
        incidentStatus: emergency.incidentStatus,
        name: emergency.name,
        lastUpdateDateTime: emergency.lastUpdateDateTime
      });
    }

    self.$onChanges = function(changesObj) {
      if (changesObj.emergencies.currentValue.length > 0 && changesObj.emergencies.currentValue !== changesObj.emergencies.previousValue) {
        features = changesObj.emergencies.currentValue.map(function(item) {
          return getEmergencyFeature(item);
        });

        if (emergencyLayerSource == undefined) {
          emergencyLayerSource = new ol.source.Vector({ features: features });
        }
        else {
          emergencyLayerSource.clear();
          emergencyLayerSource.addFeatures(features);
        }

        if (emergencyLayer == undefined) {
          emergencyLayer = new ol.layer.Vector({
            source: emergencyLayerSource,
            style: emergencyLayerStyle
          });

          map.addLayer(emergencyLayer);

          selectedEmergency = new ol.interaction.Select({
            layers: [emergencyLayer],
            style: selectedEmergencyStyle
          });

          map.addInteraction(selectedEmergency);

          selectedEmergency.on('select', function(e) {
            if (e.selected.length > 0) {
              // show degails
            }
          });
        }
      }
    };
  },
  bindings: {
    emergencies: '<'
  }
});
