<?php
Route::group(['middleware' => ['validate.website'], 'namespace' => 'system', 'as' => 'system-'], function () {

    //Manage users
    Route::group(['as' => 'user-', 'prefix' => 'user'], function () {
        Route::post('fetch/status', ['as' => 'fetch-status', 'uses' => 'UserController@fetchStatus'])->middleware(['throttle:6,1']);
        Route::post('fetch/cdn/status', ['as' => 'fetch-cdn-status', 'uses' => 'UserController@fetchStatus'])->middleware(['throttle:6,1']);
    });

    //Manage websites
    Route::group(['as' => 'website-', 'prefix' => 'website'], function () {
        Route::post('purge-cache', ['as' => 'purge-cache', 'uses' => 'ManageWebsiteController@purgeZone'])->middleware(['throttle:6,1']);
        Route::get('download-plugin/{token?}', ['as' => 'download-plugin', 'uses' => 'ManageWebsiteController@downloadPlugin']);
    });

});

Route::group(['namespace' => 'system', 'as' => 'system-'], function () {

    //Manage websites
    Route::group(['as' => 'website-', 'prefix' => 'website'], function () {
        Route::get('plugin-info', ['as' => 'plugin-info', 'uses' => 'ManageWebsiteController@downloadPlugin']);
    });

    //Manage users
    Route::group(['as' => 'user-', 'prefix' => 'user'], function () {
        Route::post('add-newsletter-email', ['as' => 'add-newsletter-email', 'uses' => 'UserController@addNewsletterEmail'])->middleware(['throttle:6,1']);
        Route::get('verify-newsletter-email/{id}/{token}', ['as' => 'verify-newsletter-email', 'uses' => 'UserController@verifyNewsletterEmail'])->middleware(['throttle:6,1']);
        Route::post('feedback', ['as' => 'feedback', 'uses' => 'UserController@feedback']);
        Route::put('save-usage-tracking', ['as' => 'save-usage-tracking', 'uses' => 'UserController@saveUsageTracking'])->middleware(['throttle:6,1']);
    });

    //Support
    Route::post('submit-contact-request', ['as' => 'submit-contact-request', 'uses' => 'SupportController@submitContactRequest'])->middleware(['throttle:6,1']);
    Route::post('search-articles', ['as' => 'search-articles', 'uses' => 'SupportController@searchArticles']);

    //GrooveHq webhook
    Route::group(['as' => 'groovehq-', 'prefix' => 'groovehq'], function () {
        Route::get('profile', ['as' => 'profile', 'uses' => 'GrooveHqController@profile']);
    });

    //Manage subscription
    Route::group(['as' => 'subscription-', 'prefix' => 'subscription'], function () {
        Route::get('trial-days', ['as' => 'trial-days', 'uses' => 'ManageSubscriptionController@getTrialDays']);
    });

});
