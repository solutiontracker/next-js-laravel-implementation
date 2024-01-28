<?php

namespace App\Http\Controllers\Auth\User;

use Illuminate\Http\Request;

use Illuminate\Routing\Controller;

use Illuminate\Support\Facades\Notification;

use App\Notifications\Auth\User\SignupEmailVerification;

class VerifyEmailController extends Controller
{
    public $successStatus = 200;

    public function resend(Request $request)
    {
        if($request->user()) {

            $user = $request->user();

            $token = rand(100000, 999999);

            \App\Models\UserVerify::create([
                'token' => $token,
                'user_id' => $user->id,
                'expire_at' => \Carbon\Carbon::now()->addHours(config('auth.passwords.users.expire') / 60)
            ]);

            //Send signup verification email
            Notification::sendNow($user, new SignupEmailVerification($token));

            return response()->json([
                'success' => true,
                'message' => 'Verification link sent!'
            ], $this->successStatus);
        } else {
            return response()->json([
                'success' => true,
                'message' => 'User logged out, please login again and retry it.'
            ], $this->successStatus);
        }
    }

    public function __invoke(Request $request, $id, $token)
    {
        $token = \App\Models\UserVerify::where('token', $token)->where('user_id', $id)->where('expire_at', '>', date('Y-m-d H:i:s'))->first();

        if($token) {

            $user = \App\Models\User::where('id', $id)->first();

            if($user) {

                //Delete token
                $token->delete();

                //Make email verified
                $user->markEmailAsVerified();

                return redirect(config('app.next_user_app_url').'/user/dashboard');

            }
        }

        return redirect(config('app.next_user_app_url').'/user/dashboard');

    }
}
