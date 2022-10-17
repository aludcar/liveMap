<a-scene id="sceneMarkerBased" vr-mode-ui="enabled: false" color-space="sRGB"
    renderer="precision: medium; colorManagement: true;" embedded
    arjs="debugUIEnabled: false; sourceType: webcam; patternRatio: 0.8; trackingMethod: best;" register-components>
    <a-assets>
        <img id="webIcon" src="./assets/images/website.svg" />
        <img id="locationIcon" src="./assets/images/location.svg" />
    </a-assets>

    <!-- add a simple camera -->
    <a-entity camera>
        <a-entity cursor="fuse: false; fuseTimeout: 500; " raycaster="far: 20; interval: 1000; objects: .clickable"
            position="0 0 -1" geometry="primitive: ring; radiusInner: 0.015; radiusOuter: 0.016"
            material="color: black; shader: flat">
        </a-entity>
    </a-entity>
</a-scene>
<script>
checkMarkers();
</script>