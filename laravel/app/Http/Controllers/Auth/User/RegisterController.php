<?php

namespace App\Http\Controllers\Auth\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\User\Requests\RegisterRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;
use App\Notifications\Auth\User\Welcome;
use App\Notifications\Auth\User\SignupEmailVerification;
use Illuminate\Support\Facades\Storage;
use Stevebauman\Location\Facades\Location;
use Jenssegers\Agent\Agent;

class RegisterController extends Controller
{
    public $successStatus = 200;

    public function __construct()
    {
        $this->middleware('guest:api')->except('logout');
    }

    /**
     * register api
     *
     * @return \Illuminate\Http\Response
     */

    protected function sendFailedLoginResponse(Request $request)
    {
        $errors = ['email' => trans('auth.failed')];
        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'errors' => $errors,
            ], 422);
        }
        return response()->json([
            'success' => false,
            'errors' => $errors,
        ], $this->successStatus);
    }

    /**
     * @param LoginRequest $request
     *
     * @return [type]
     */
    public function register(RegisterRequest $request)
    {
        $agent = new Agent();

        $browser = $agent->browser();

        $version = $agent->version($browser);

        $platform = $agent->platform();

        $user_agent = array(
            'platform' => $platform,
            'browser' => $browser,
            'version' => $version,
            'isWindow' => $agent->is('Windows'),
            'firefox' => $agent->is('Firefox'),
            'iPhone' => $agent->is('iPhone'),
            'os' => $agent->is('OS X'),
            'android' => $agent->isAndroidOS(),
            'isNexus' => $agent->isNexus(),
            'languages' => $agent->languages(),
            'device' => $agent->device(),
            'isDesktop' => $agent->isDesktop(),
            'isPhone' => $agent->isPhone(),
            'isMobile' => $agent->isMobile(),
            'isTablet' => $agent->isTablet(),
            'isRobot' => $agent->isRobot(),
            'robot' => $agent->robot()
        );

        $visitor_info = Location::get();

        $token = \Str::random(60);

        $country_id = \App\Models\Country::where('iso', isset($visitor_info->countryCode) ? $visitor_info->countryCode : 0)->value('id');

        $user =  \App\Models\User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'name' => $request->first_name.' '.$request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'profession' => $request->profession,
            'password' => bcrypt($request->password),
            'status' => "active",
            'country_id' => (int)$country_id,
            'api_token' => hash('sha256', $token),
            'registration_ip' => isset($visitor_info->ip) ? $visitor_info->ip : $request->ip(),
            'continent' => '',
            'city' => isset($visitor_info->cityName) ? $visitor_info->cityName : '',
            'state' => isset($visitor_info->regionName) ? $visitor_info->regionName : '',
            'use_agent' => isset($user_agent) ? $user_agent : '',
        ]);

        $token = rand(100000, 999999);

        \App\Models\UserVerify::create([
            'token' => $token,
            'user_id' => $user->id,
            'expire_at' => \Carbon\Carbon::now()->addHours(config('auth.passwords.users.expire') / 60)
        ]);

        //Send signup verification email
        Notification::sendNow($user, new SignupEmailVerification($token));

        //Notification welcome
        Notification::sendNow($user, new Welcome());

        $tokenResult = $user->createToken(config('app.name'));

        $token = $tokenResult->token;

        $token->save();

        //user last login ip save
        $user->last_login_ip = $request->getClientIp();

        $user->last_login = Carbon::now();

        $user->save();

        return response()->json([
            'success' => true,
            'data'    => array(
                'access_token' => $tokenResult->accessToken,
                //'api_key' => $website->token,
                'token_type' => 'Bearer',
                'expires_at' => Carbon::parse(
                    $tokenResult->token->expires_at
                )->toDateTimeString(),
                'user' => array(
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email
                ),
                'message' => "Verification email has been send to your email address, please verify it."
            )
        ], $this->successStatus);
    }

    //defining which guard to use in our case, it's the api guard
    protected function guard()
    {
        return Auth::guard('api');
    }
}
