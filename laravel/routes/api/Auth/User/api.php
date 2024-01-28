<?php
Route::group(['middleware' => ['guest'], 'namespace' => 'Auth', 'as' => 'user-'], function () {
    Route::group(['prefix' => 'auth', 'namespace' => 'User', 'as' => 'auth-'], function () {

        Route::post('registration', ['as' => 'registration', 'uses' => 'RegisterController@register']);
        Route::post('login', ['as' => 'login', 'uses' => 'LoginController@login']);
        Route::get('auto-login/{token?}', ['as' => 'auto-login', 'uses' => 'LoginController@autoLogin']);
        Route::post('register', ['as' => 'register', 'uses' => 'RegisterController@register']);
        Route::post('password/email', ['as' => 'password-email', 'uses' => 'ForgotPasswordController@sendResetLinkEmail'])->middleware(['throttle:6,1']);
        Route::post('password/reset', ['as' => 'reset', 'uses' => 'ResetPasswordController@reset'])->middleware(['throttle:6,1']);

        //Social login
        Route::post('social-login', 'LoginController@social_login');
    });
});

//Laravel build in features
Route::group(['namespace' => 'Auth'], function () {
    Route::group(['prefix' => 'auth', 'namespace' => 'User'], function () {
        Route::get('/email/verify/{id}/{token}', 'VerifyEmailController@__invoke')
            ->middleware(['throttle:6,1'])
            ->name('verification.verify');

        Route::post('/email/verify/resend', 'VerifyEmailController@resend')
            ->middleware(['auth:api', 'throttle:6,1'])
            ->name('verification.send');

        //Verified logged user
        Route::get('/email/verify', function () {
            return view('auth.verify-email');
        })->middleware('api')->name('verification.notice');
    });
});
//End

Route::group(['middleware' => ['auth:api'], 'namespace' => 'Auth', 'as' => 'user-'], function () {
    Route::group(['prefix' => 'auth', 'namespace' => 'User', 'as' => 'auth-'], function () {
        Route::post('logout', ['as' => 'logout', 'uses' => 'LoginController@logout']);
    });
});
