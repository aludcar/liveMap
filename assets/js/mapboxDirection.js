let markersGps = [];
let startCoord = [];
let endCoord = [];
let map;

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWx1ZGNhciIsImEiOiJjbDk3M3hqb3gydXF4M290NTJ1d2xhcDJiIn0.NGetCaLopga2eAdJyeJz9A";

async function getRoute(end) {
  // make a directions request using cycling profile
  // an arbitrary start will always be the same
  // only the end or destination will change
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/walking/${startCoord[0]},${startCoord[1]};${endCoord[0]},${endCoord[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
    {
      method: "GET",
    }
  );
  const json = await query.json();
  const data = json.routes[0];
  const route = data.geometry.coordinates;
  const geojson = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: route,
    },
  };
  // if the route already exists on the map, we'll reset it using setData
  if (map.getSource("route")) {
    map.getSource("route").setData(geojson);
  }
  // otherwise, we'll make a new request
  else {
    map.addLayer({
      id: "route",
      type: "line",
      source: {
        type: "geojson",
        data: geojson,
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#3887be",
        "line-width": 5,
        "line-opacity": 0.75,
      },
    });
  }
}

if (navigator.geolocation) {
  try {
    navigator.geolocation.getCurrentPosition((position) => {
      let paramString = window.location.href.split("?")[1];
      let queryString = new URLSearchParams(paramString);

      for (let pair of queryString.entries()) {
        if (pair[0] === "coord") {
          endCoord = pair[1].split(",");
        }
      }
      //longitude , latitude
      startCoord = [position.coords.longitude, position.coords.latitude];

      map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: startCoord,
        zoom: 13,
      });

      map.on("load", () => {
        getRoute(endCoord);
        checkMarkers(true, endCoord);

        // Add starting point to the map
        map.addLayer({
          id: "point",
          type: "circle",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Point",
                    coordinates: startCoord,
                  },
                },
              ],
            },
          },
          paint: {
            "circle-radius": 10,
            "circle-color": "#3887be",
          },
        });
        map.addLayer({
          id: "end",
          type: "circle",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Point",
                    coordinates: endCoord,
                  },
                },
              ],
            },
          },
          paint: {
            "circle-radius": 10,
            "circle-color": "#f30",
          },
        });
      });
    });
  } catch (error) {
    console.error(error);
  }
}
