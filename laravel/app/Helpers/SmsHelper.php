<?php
function sendSMS($sms_body, $phone, $p_sender_name)
{
    if (strlen($phone) == 8) {
        $phone        = '45' . $phone;
    }
    $results = array();
    $phone = str_replace('-', '', $phone);
    $phone = str_replace('+', '', $phone);
    $url = "http://www.cpsms.dk/sms/";
    $url .= "?message=" . urlencode(htmlspecialchars_decode(strip_tags($sms_body)));
    $url .= "&recipient=" . $phone; // Recipient
    $url .= "&username=" . 'aboutmobile'; // aboutmobile
    $url .= "&password=" . 'Eb2o19ki'; // idris123
    $url .= "&from=" . urlencode($p_sender_name); // Sendername
    $url .= "&utf8=1"; // UTF8 encoded.
    $reply = file_get_contents($url);
    if (strstr($reply, "<succes>")) {
        // If the reply contains the tag <succes> the SMS has been sent.
        $results['status']        = 1;
        $results['status_msg']        = 'Delivery successful';
        //echo "The message has been sent. Server response: ".$reply;
    } else {
        // If not, there has been an error.
        //return "Server response: ".$reply;
        $results['status']        = 0;
        $results['status_msg']        = $reply;
        // echo "The message has NOT been sent. Server response: ".$reply;
    }
    return $results;
}