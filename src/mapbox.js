/* eslint-disable */
// const locations = JSON.parse(document.getElementById('map').dataset.locations);
export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoicmVhbnppIiwiYSI6ImNqdXptNXF6ODA5cWM0Zm51MG1wdjlhamIifQ.JlRzQ1n2KtrkgnIa1rnDDQ';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/reanzi/ck8939tsr0czo1iqfl3wz2zeq',
    scrollZoom: false
    //   center: [38.900002, -6.433333],
    //   zoom: 15,
    //   interactive: false
  });

  const bound = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create a marker
    const el = document.createElement('div');
    el.className = 'marker';

    //   Add a marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add a Popup
    new mapboxgl.Popup({ offset: 35 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day} : ${loc.description}</p>`)
      .addTo(map);

    // Extend the map bounds to include the locations
    bound.extend(loc.coordinates);
  });

  map.fitBounds(bound, {
    padding: {
      top: 200,
      bottom: 100,
      left: 20,
      right: 20
    }
  });
};
