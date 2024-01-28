<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'bunnycdn' => [
        'plugin_download_token' => env('BUNNYCDN_PLUGIN_DOWNLOAD_TOKEN'),
        'plugin_download_endpoint_url' => env('BUNNYCDN_PLUGIN_DOWNLOAD_ENDPOINT_URL'),
        'apiKey' => env('BUNNYCDN_API_KEY'),
        'endpoint_url' => env('BUNNYCDN_CDN_ENDPOINT'),
    ],

    'digitalocean' => [
        'apiKey' => env('DIGITALOCEAN_API_KEY')
    ],

    'cdn' => [
        'domain' => env('CDN_DOMAIN')
    ],

    'recaptcha' => [
        'secret' => env('GOOGLE_RECAPTCHA_SECRET'),
    ],

    'stripe' => [
        'model'  => 'App\Models\User',
        'key'    => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'payment_prefix' => 'system',
    ],

    'groovehq' => [
        'api_key' => env('GROOVE_HQ_API_KEY'),
    ],

    'frill' => [
        'api_key' => env('FRILL_API_KEY'),
    ],

];
