<?php
// Initialize cURL
$url = "https://www.cnn.com";
$curl = curl_init($url);

// Set cURL options
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/html']);
curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);

$response = curl_exec($curl);

// Check for errors
if ($response === false) {
    echo 'Error: ' . curl_error($curl);
} else {
    if (empty($response)) {
        echo 'Error: Empty response';
    } else {
        echo "[$response]";
    }
}

curl_close($curl);
?>