<?php
$tweets = $_POST['tweet_data'];

if($_POST && array_key_exists('tweet_data', $_POST)) {

    if (!file_exists('output')) {
        mkdir('output', 0777, true);
    }

    $filename = date("Y-m-d--H-i-s");

    $fd = fopen ('output/'.$filename.".csv", "w");
    fputs($fd, pack("CCC", 0xef, 0xbb, 0xbf));

    $csv_string = '';

    for( $t = 0; $t < count($tweets); $t++ ) {
        $tweet_array = array(($t + 1), $tweets[$t]);
        fputcsv($fd, $tweet_array);
    }

    fputs($fd, $csv_string);
    fclose($fd);

    echo 'output/'.$filename.'.csv';

} else {
    echo 'error';
}
?>