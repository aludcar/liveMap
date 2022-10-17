<?php
    $path = "../assets/bulk/bulk-loading.csv";
    // open csv file
    if (!($fp = fopen($path, 'r'))) {
        die("Can't open file...");
    }

    //read csv headers
    $key = fgetcsv($fp,"1024",",");

    // parse csv rows into array
    $json = array();
        while ($row = fgetcsv($fp,"1024",",")) {
        $json[] = array_combine($key, $row);
    }
    // release file handle
    fclose($fp);

    // encode array to json
    echo json_encode(array($json));