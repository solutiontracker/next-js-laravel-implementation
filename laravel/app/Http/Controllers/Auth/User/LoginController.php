<?php

namespace App\Http\Controllers\Auth\User;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;

use App\Http\Controllers\Auth\User\Requests\LoginRequest;

use App\Http\Controllers\Auth\User\Requests\SocialLoginRequest;

use Illuminate\Support\Facades\Notification;

use App\Notifications\Auth\User\Welcome;

use Carbon\Carbon;

use Stevebauman\Location\Facades\Location;

use Jenssegers\Agent\Agent;
class LoginController extends Controller
{
    public $successStatus = 200;

    public function __construct()
    {
        $this->middleware('guest:api')->except('logout');
    }

    /**
     * login api
     *
     * @return \Illuminate\Http\Response
     */

    protected function sendFailedLoginResponse(Request $request)
    {
        $errors = ['email' => trans('auth.failed')];

        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => implode(' ', $errors),
            ], 422);
        }

        return response()->json([
            'success' => false,
            'message' => implode(' ', $errors),
        ], $this->successStatus);
    }

    /**
     * @return [type]
     */
    protected function sendInactiveLoginResponse()
    {
        return response()->json([
            'success' => false,
            'message' => "Account is blocked",
        ], $this->successStatus);
    }

    /**
     * @return [type]
     */
    protected function sendNotVerifiedWebsiteResponse()
    {
        return response()->json([
            'success' => false,
            'message' => "You are not authorized to login",
        ], $this->successStatus);
    }

    /**
     * @param LoginRequest $request
     *
     * @return [type]
     */
    public function login(LoginRequest $request)
    {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password], $request->get('remember'))) {
            $user = Auth::user();
            return $this->login_process($request, $user);
        } else {
            return $this->sendFailedLoginResponse($request);
        }
    }

    //defining which guard to use in our case, it's the api guard
    protected function guard()
    {
        return Auth::guard('api');
    }

    /**
     * @param Request $request
     *
     * @return [type]
     */
    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response()->json([
            'success' => true,
        ]);
    }

    /**
     * @param $user
     *
     * @return [type]
     */
    public function login_process($request, $user)
    {
        if ($user->status == 'block') {
            return $this->sendInactiveLoginResponse($request);
        }

        $tokenResult = $user->createToken(config('app.name'));

        $token = $tokenResult->token;

        if (!$request->remember) {
            $token->expires_at = Carbon::now()->addDay();
        }

        $token->save();

        //user last login ip save
        $user->last_login_ip = $request->getClientIp();

        $user->last_login = Carbon::now();

        //Frill token
        if(!$user->frill_token) {
            $user->frill_token = getFrillToken($user);
        }

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

        //Visitor info
        $visitor_info = Location::get();
        $user->registration_ip = isset($visitor_info->ip) ? $visitor_info->ip : $request->ip();
        $user->continent = '';
        $user->city = isset($visitor_info->cityName) ? $visitor_info->cityName : '';
        $user->state = isset($visitor_info->regionName) ? $visitor_info->regionName : '';
        $user->use_agent = isset($user_agent) ? $user_agent : '';

        $user->save();

        return response()->json([
            'success' => true,
            'data'    => array(
                'access_token' => $tokenResult->accessToken,
                'token_type' => 'Bearer',
                'user' => array(
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email
                )
            )
        ], $this->successStatus);
    }

    /**
     * @param SocialLoginRequest $request
     *
     * @return [type]
     */
    public function social_login(SocialLoginRequest $request)
    {
        $query = \App\Models\User::query();

        if ($request->provider === "google") {
            $query->where('google_id', $request->provider_id);
        } elseif ($request->provider === "facebook") {
            $query->where('facebook_id', $request->provider_id);
        } elseif ($request->provider === "wordpress") {
            $query->where('wordpress_id', $request->provider_id);
        }

        $user = $query->first();

        if (!$user) {

            $user = \App\Models\User::where('email', $request->email)->first();

            if ($user) {

                if ($request->provider === "google") {
                    $user->google_id = $request->provider_id;
                } elseif ($request->provider === "facebook") {
                    $user->facebook_id = $request->provider_id;
                } elseif ($request->provider === "wordpress") {
                    $user->wordpress_id = $request->provider_id;
                }

                $user->save();

            } else {

                $parts = explode(" ", $request->name, 2);

                $first_name = isset($parts[0]) && $parts[0] ? $parts[0] : '';

                $last_name = isset($parts[1]) && $parts[1] ? $parts[1] : '';

                $last_name = count($parts) == 3 ? $last_name.' '.$parts[2] : $last_name;

                $user = \App\Models\User::create([
                    'name' => $first_name.' '.$last_name,
                    'first_name' => $first_name,
                    'last_name' => $last_name,
                    'email' => $request->email,
                    'google_id' => $request->google_id,
                    'facebook_id' => $request->facebook_id,
                    'wordpress_id' => $request->wordpress_id,
                    'status' => "active"
                ]);

                //Notification welcome
                Notification::sendNow($user, new Welcome());
            }

        }

        //Verification email
        if(!$user->email_verified_at) {
            $user->email_verified_at = \Carbon\Carbon::now();
            $user->save();
        }

        return $this->login_process($request, $user);
    }
}
