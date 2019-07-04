<?php
/*
 * Generate a pair of public and private keys.
 *
 * Test the keys.
 *
 */
define("NOAUTH", true);
require_once "../../../redcap_connect.php";


// --------------- CONFIGURATION --------------- //
$key_filename = './keys/symmetric_key_temp.pem';

// Configuration settings for the key
$encryption_method = "aes-256-gcm";
$tag_length = 16;

// --------------- KEY GENERATION --------------- //
$key = random_bytes(32);

$export_success = file_put_contents($key_filename, $key);
if($export_success){
    echo "<p>AES key has been succesfully generated at location ".$key_filename.".<p>";
} else{
    echo "AES key export has failed.<br>";
}
echo $key."<br>";


// --------------- TEST MESSAGE ENCRYPTION --------------- //
$text = "Hello! How are you today?";


$iv_length = openssl_cipher_iv_length($encryption_method);
$iv = random_bytes($iv_length);
$encrypted_text = openssl_encrypt($text, $encryption_method, $key, $options=0, $iv, $tag);
$encrypted_message = $iv.$tag.$encrypted_text;

// --------------- TEST DECRYPT MESSAGE --------------- //
$loaded_key = file_get_contents($key_filename); // Get AES key


$loaded_iv = substr($encrypted_message, 0, $iv_length);
$loaded_tag = substr($encrypted_message, $iv_length, $tag_length);
$loaded_encrypted_text = substr($encrypted_message, $iv_length + $tag_length);

$decrypted_text = openssl_decrypt($loaded_encrypted_text, $encryption_method, $loaded_key, $options=0, $loaded_iv, $loaded_tag);
echo "<br>************************************************************<br>";
echo $encrypted_text."<br>";
echo $loaded_encrypted_text."<br>";

echo $text."<br>";
echo $decrypted_text;
?>