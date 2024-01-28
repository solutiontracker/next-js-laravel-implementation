<?php

namespace App\Http\Controllers\Auth\User;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Auth\User\Requests\ResetPasswordRequest;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use App\Notifications\Auth\User\PasswordUpdated;
class ResetPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset requests
    | and uses a simple trait to include this behavior. You're free to
    | explore this trait and override any methods you wish to tweak.
    |
    */

    public $successStatus = 200;

    public function __construct()
    {
        $this->middleware('guest:api')->except('logout');
    }

    public function reset(ResetPasswordRequest $request)
    {
        $response = $this->broker()->reset(
            $this->credentials($request),
            function ($user, $password) {
                $this->resetPassword($user, $password);
                Notification::sendNow($user, new PasswordUpdated());
            }
        );

        return $response == Password::PASSWORD_RESET
            ? $this->sendResetResponse($response)
            : $this->sendResetFailedResponse($request, $response);
    }

    protected function resetPassword($user, $password)
    {
        $user->forceFill([
            'password' => bcrypt($password),
            'remember_token' => Str::random(60),
        ])->save();

        //$this->guard()->login($user);
    }

    protected function sendResetResponse($response)
    {
        return response()->json([
            'success' => true,
            'redirect' => true,
            'message' => trans($response),
        ], $this->successStatus);
    }

    protected function sendResetFailedResponse(Request $request, $response)
    {
        return response()->json([
            'success' => false,
            'message' => trans($response),
        ], $this->successStatus);
    }

    protected function credentials(ResetPasswordRequest $request)
    {
        return array(
            'email' => $request->email,
            'password' => $request->password,
            'password_confirmation' => $request->password,
            'token' => $request->token
        );
    }

    //defining which guard to use in our case, it's the api guard
    protected function guard()
    {
        return Auth::guard('api');
    }

    //defining our password broker function
    protected function broker()
    {
        return Password::broker('users');
    }
}
