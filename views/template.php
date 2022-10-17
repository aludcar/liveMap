<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="apple-mobile-web-app-capable" content="yes" />

    <script src="https://aframe.io/releases/1.3.0/aframe.min.js"></script>
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
    <script src="https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js"></script>

    <script src='https://unpkg.com/@turf/turf/turf.min.js'></script>

    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.css' rel='stylesheet' />
    <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.js'></script>

    <link href="./assets/css/styles.css" rel='stylesheet' />
    <script src="./assets/js/components.js"></script>
    <title>Mapa Vivo</title>
</head>

<body>
    <?php 
				if(isset($_GET["page"])){

					if($_GET["page"] == "marker-based" ||
					   $_GET["page"] == "location-based"){

						include "pages/".$_GET["page"].".php";

					}else{

						include "pages/error404.php";
					}


				}else{

					include "pages/login.php";

				}
    ?>

</body>

</html>