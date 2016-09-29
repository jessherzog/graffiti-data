// initialize the map and set its view to our chosen geographical coordinates and a zoom level:
var mymap = L.map('mapid', 'mapbox.streets').setView([40.728202, -73.987877], 15);

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieGl1eGl1eHh4IiwiYSI6ImNpdDFuM3VxYjBxem4ycHFwcHAzMG5lZHIifQ.dvASaKLVsXfV_2tN2aATMg', {
    attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapid',
    accessToken: 'pk.eyJ1IjoieGl1eGl1eHh4IiwiYSI6ImNpdDFuM3VxYjBxem4ycHFwcHAzMG5lZHIifQ.dvASaKLVsXfV_2tN2aATMg'
}).addTo(mymap);

var run93Layer = omnivore.gpx('/assets/routes GPX/sept_3.gpx')
    .on('ready', function() {
        mymap.fitBounds(run93Layer.getBounds());
    })
    .addTo(mymap);

// var run94Layer = omnivore.gpx('/assets/routes GPX/sept_4.gpx')
// .on('ready', function() {
//     mymap.fitBounds(run94Layer.getBounds());
// })
// .addTo(mymap);

// var run95Layer = omnivore.gpx('/assets/routes GPX/sept_5.gpx')
// .on('ready', function() {
//     mymap.fitBounds(run95Layer.getBounds());
// })
// .addTo(mymap);

// var run96Layer = omnivore.gpx('/assets/routes GPX/sept_6.gpx')
// .on('ready', function() {
//     mymap.fitBounds(run96Layer.getBounds());
// })
// .addTo(mymap);

// var run97Layer = omnivore.gpx('/assets/routes GPX/sept_7.gpx')
//     .on('ready', function() {
//         mymap.fitBounds(run97Layer.getBounds());
//     })
//     .addTo(mymap);


// filter points, pick every 20th, 50th, 100th point
// get rid of anything > 40.72
// heat maps - more points are hotter, possible data vis
   