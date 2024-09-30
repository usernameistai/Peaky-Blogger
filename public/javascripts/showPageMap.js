mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: walk.geometry.coordinates,
    zoom: 7,
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(walk.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h4 style="color: #D4AF37;">${walk.title}</h4><p style="color: teal;">${walk.location}</p>`)
    )
    .addTo(map);
