const maxDistance = 5; //meters
let markersArr = [];
let locationBased = {
  hasGps: false,
  endCoord: [],
};

const checkMarkers = (hasGps = false, endCoord = []) => {
  if (hasGps) {
    locationBased.endCoord = endCoord;
    locationBased.hasGps = hasGps;
  }
  if (markersArr && markersArr.length === 0) {
    initMarkers();
  } else {
    registerComponents();
  }
};

const filterMarkers = () => {
  let options = {
    units: "kilometers",
  };
  try {
    return markersArr.filter((marker) => {
      let distance =
        turf
          .distance(
            marker.coordinates.split(","),
            locationBased.endCoord,
            options
          )
          .toFixed([2]) * 1000;
      if (distance <= maxDistance) return marker;
    });
  } catch (error) {
    console.error(error);
  }
};

const initMarkers = async () => {
  try {
    const response = await fetch(
      "./controllers/file-convert-json.controller.php"
    );
    let records = await response.json();
    markersArr = records.length > 0 ? records[0] : [];

    const markers = !locationBased.hasGps ? markersArr : filterMarkers();
    registerComponents(markers);
  } catch (e) {
    console.log("Fetch error: ", e);
  }
};

const registerComponents = (markers) => {
  const sceneEl = document.querySelector("a-scene");
  let assetsEl = document.querySelector("a-assets");
  if (!assetsEl) {
    assetsEl = document.createElement("a-assets");
    sceneEl.appendChild(assetsEl);
  }
  if (markers.length > 0) {
    for (let marker of markers) {
      const videoAsset = document.createElement("video");
      videoAsset.setAttribute("id", "video_" + marker.name);
      videoAsset.setAttribute("preload", "auto");
      videoAsset.setAttribute("src", marker.video);
      videoAsset.setAttribute("loop", true);
      videoAsset.setAttribute("crossorigin", "anonymous");
      videoAsset.setAttribute("muted", true);
      assetsEl.appendChild(videoAsset);

      if (!locationBased.hasGps) {
        const markerEl = document.createElement("a-marker");
        markerEl.setAttribute("id", "marker_" + marker.name);
        markerEl.setAttribute("type", "pattern");
        markerEl.setAttribute("url", marker.patternUrl);
        markerEl.setAttribute("data-name", marker.name);
        markerEl.setAttribute("data-website", marker.website);
        markerEl.setAttribute("data-coordinates", marker.coordinates);
        markerEl.setAttribute("register-componentmarker", "");
        sceneEl.appendChild(markerEl);
      } else {
        const entityEl = document.createElement("a-entity");
        entityEl.setAttribute("id", "marker_" + marker.name);
        entityEl.setAttribute("data-name", marker.name);
        entityEl.setAttribute("data-coordinates", marker.coordinates);
        entityEl.setAttribute("register-componentmarker", "");
        sceneEl.appendChild(entityEl);
      }
    }
  }
};

AFRAME.registerComponent("register-componentmarker", {
  init: function () {
    const markerEl = this.el;
    const markerName = markerEl.getAttribute("data-name");
    const idVideo = "#video_" + markerName;
    const coordinates = markerEl.getAttribute("data-coordinates").split(",");

    markerEl.addEventListener("markerFound", () => {
      let videoEl = document.querySelector(idVideo);
      videoEl.muted = true;
      videoEl.play();
    });

    markerEl.addEventListener("markerLost", () => {
      let videoEl = document.querySelector(idVideo);
      videoEl.muted = true;
      videoEl.pause();
    });

    /*Entity container video*/
    const entityVideoEl = document.createElement("a-entity");
    entityVideoEl.setAttribute("material", {
      shader: "flat",
      src: idVideo,
      opacity: "0.95",
    });
    entityVideoEl.setAttribute("geometry", {
      primitive: "plane",
      width: "1",
      height: "1.5",
    });
    entityVideoEl.setAttribute("position", " 0 0 0");
    entityVideoEl.setAttribute("rotation", "-90 0 0");
    entityVideoEl.setAttribute("data-video", idVideo);

    //longitude , latitude arraycoordinates
    entityVideoEl.setAttribute(
      "gps-entity-place",
      `latitude: ${coordinates[1]}; longitude: ${coordinates[0]}`
    );
    markerEl.appendChild(entityVideoEl);

    /**Components in container video**/

    const textEl = document.createElement("a-text");
    textEl.setAttribute("id", "text_" + markerName);
    textEl.setAttribute("value", markerName);
    textEl.setAttribute("position", "0 -0.20 0.1");
    textEl.setAttribute("align", "center");
    textEl.setAttribute("height", "auto");
    textEl.setAttribute("width", "2.5");
    textEl.setAttribute("font", "./assets/fonts/inert-bold.fnt");
    entityVideoEl.appendChild(textEl);

    if (!locationBased.hasGps) {
      const webIconEl = document.createElement("a-circle");
      webIconEl.setAttribute("id", "webIcon_" + markerName);
      webIconEl.setAttribute("class", "clickable");
      webIconEl.setAttribute("src", "#webIcon");
      webIconEl.setAttribute("radius", "0.12");
      webIconEl.setAttribute("rotation", "0 0 0");
      webIconEl.setAttribute("position", "0.28 -0.48 0.25");
      webIconEl.setAttribute("animation", {
        property: "scale",
        to: "1.2 1.2 1.2",
        dur: "1000",
        easing: "easeInOutQuad",
        loop: true,
        dir: "alternate",
      });
      webIconEl.addEventListener("click", () => {
        window.open(markerEl.getAttribute("data-website"), "_blank");
      });
      entityVideoEl.appendChild(webIconEl);

      const locationIconEl = document.createElement("a-circle");
      locationIconEl.setAttribute("id", "btnLocation_" + markerName);
      locationIconEl.setAttribute("class", "clickable");
      locationIconEl.setAttribute("src", "#locationIcon");
      locationIconEl.setAttribute("radius", "0.12");
      locationIconEl.setAttribute("rotation", "0 0 0");
      locationIconEl.setAttribute("position", "-0.28 -0.48 0.25");
      locationIconEl.setAttribute("animation", {
        property: "scale",
        to: "1.2 1.2 1.2",
        dur: "1000",
        easing: "easeInOutQuad",
        loop: true,
        dir: "alternate",
      });
      locationIconEl.addEventListener("click", () => {
        window.location.assign(
          `/livemap/index.php?page=location-based&coord=${markerEl.getAttribute(
            "data-coordinates"
          )}`
        );
      });
      entityVideoEl.appendChild(locationIconEl);
    }
  },
});
