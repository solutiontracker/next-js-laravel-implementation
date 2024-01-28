<?php

//Authentication
Route::group(['middleware' => ['auth:api'], 'namespace' => 'User', 'as' => 'user-', 'prefix' => 'user'], function () {
    //My account
    Route::group(['as' => 'account-', 'prefix' => 'account'], function () {
        Route::post('profile', ['as' => 'profile', 'uses' => 'ManageProfileController@index']);
        Route::post('update-profile', ['as' => 'update-profile', 'uses' => 'ManageProfileController@update']);
        Route::post('discard-new-email', ['as' => 'discard-new-email', 'uses' => 'ManageProfileController@discard']);
        Route::post('resend-verification-email', ['as' => 'resend-verification-email', 'uses' => 'ManageProfileController@resendVerificationEmail'])->middleware(['throttle:2,1']);
        Route::post('remove-avatar', ['as' => 'remove-avatar', 'uses' => 'ManageProfileController@removeAvatar']);

        Route::post('connect-account', ['as' => 'connect-account', 'uses' => 'ManageProfileController@connectAccount']);
        Route::post('disconnect-account', ['as' => 'disconnect-account', 'uses' => 'ManageProfileController@disconnectAccount']);
        Route::post('update-auto-recharge', ['as' => 'update-auto-recharge', 'uses' => 'ManageProfileController@updateAutoRecharge']);
    });

    //Website
    Route::group(['as' => 'website-', 'prefix' => 'website'], function () {
        Route::post('listing/{page?}', ['as' => 'listing', 'uses' => 'ManageWebsiteController@index']);
        Route::post('store', ['as' => 'store', 'uses' => 'ManageWebsiteController@store']);
        Route::post('update/{id}', ['as' => 'update', 'uses' => 'ManageWebsiteController@update']);
        Route::delete('destroy/{id}', ['as' => 'destroy', 'uses' => 'ManageWebsiteController@destroy']);
        Route::post('cdn-stats', ['as' => 'cdn-stats', 'uses' => 'ManageWebsiteController@cdnStats']);
        Route::post('fetch/{id}', ['as' => 'fetch-by-id', 'uses' => 'ManageWebsiteController@fetch']);
        Route::post('fetch-by-url', ['as' => 'fetch-by-url', 'uses' => 'ManageWebsiteController@fetchByUrl']);
        Route::post('download-plugin', ['as' => 'download-plugin', 'uses' => 'ManageWebsiteController@downloadPlugin']);
    });

    //Subscriptions
    Route::group(['as' => 'subscription-', 'prefix' => 'subscription'], function () {
        Route::post('create-setup-payment', ['as' => 'create-setup-payment', 'uses' => 'ManageSubscriptionController@createSetupIntent']);
        Route::post('create', ['as' => 'create', 'uses' => 'ManageSubscriptionController@create']);
        Route::post('update', ['as' => 'update', 'uses' => 'ManageSubscriptionController@update']);
        Route::post('preview-invoice', ['as' => 'preview-invoice', 'uses' => 'ManageSubscriptionController@previewInvoice']);
        Route::post('latest-invoice', ['as' => 'latest-invoice', 'uses' => 'ManageSubscriptionController@latestInvoice']);
        Route::match(['get', 'post'], 'payment-confirm/{paymentIntent}', ['as' => 'payment-confirm', 'uses' => 'ManageSubscriptionController@paymentConfirm']);
        Route::match(['get', 'post'], 'payment-confirm-card/{paymentIntent}', ['as' => 'payment-confirm-card', 'uses' => 'ManageSubscriptionController@paymentConfirmByCard']);
        Route::post('get-all-subscriptions', ['as' => 'get-all-subscriptions', 'uses' => 'ManageSubscriptionController@getAllSubscriptions']);
        Route::post('cancel', ['as' => 'cancel', 'uses' => 'ManageSubscriptionController@cancel']);
        Route::post('resume', ['as' => 'resume', 'uses' => 'ManageSubscriptionController@resume']);
        Route::post('payment-methods', ['as' => 'payment-methods', 'uses' => 'ManageSubscriptionController@getPaymentMethods']);
        Route::post('create-payment-method', ['as' => 'create-payment-method', 'uses' => 'ManageSubscriptionController@createPaymentMethod']);
        Route::post('delete-payment-method', ['as' => 'delete-payment-method', 'uses' => 'ManageSubscriptionController@deletePaymentMethod']);
        Route::post('make-default-payment-method', ['as' => 'make-default-payment-method', 'uses' => 'ManageSubscriptionController@makeDefaultPaymentMethod']);
        Route::post('billing-history', ['as' => 'billing-history', 'uses' => 'ManageSubscriptionController@getBillingHistory']);
        Route::post('recharge-balance', ['as' => 'recharge-balance', 'uses' => 'ManageSubscriptionController@reachargeBalance']);
        Route::post('redeem-ltd-code', ['as' => 'redeem-ltd-code', 'uses' => 'ManageSubscriptionController@redeemLtdCode']);
        Route::post('cancel-ltd-deal', ['as' => 'cancel-ltd-deal', 'uses' => 'ManageSubscriptionController@cancelLtdDeal']);
    });

    //Support
    Route::group(['as' => 'support-', 'prefix' => 'support'], function () {
        Route::post('create-ticket', ['as' => 'create-ticket', 'uses' => 'SupportController@createTicket'])->middleware(['throttle:6,1']);
    });

});

//Without Authentication
Route::group(['namespace' => 'User', 'as' => 'user-', 'prefix' => 'user'], function () {
    //My account
    Route::group(['as' => 'account-', 'prefix' => 'account'], function () {
        Route::get('update-email/{id}/{token}', ['as' => 'update-email', 'uses' => 'ManageProfileController@updateEmail']);
    });

    //Subscriptions
    Route::group(['as' => 'subscription-', 'prefix' => 'subscription'], function () {
        Route::get('download-invoice/{user_id}/{invoice_id}/{plan_id?}', ['as' => 'download-invoice', 'uses' => 'ManageSubscriptionController@downloadInvoice']);
    });

    //Plans
    Route::group(['as' => 'plan-', 'prefix' => 'plan'], function () {
        Route::post('plans', ['as' => 'index', 'uses' => 'ManagePlanController@index']);
        Route::get('{id}', ['as' => 'get-plan', 'uses' => 'ManagePlanController@getPlan']);
    });
});
