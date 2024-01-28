<?php

namespace App\Http\Controllers\User;

use App\Repositories\UserRepository;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Http\Controllers\User\Requests\MyAccount\UpdateProfileRequest;

class ManageProfileController extends Controller
{
    public $successStatus = 200;

    protected $userRepository;

    /**
     * @param UserRepository $userRepository
     */
    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * index
     *
     * @param  mixed $request
     * @return void
     */
    public function index(Request $request)
    {
        $user = request()->user();

        return response()->json([
            "success" => true,
            "data" => $this->userRepository->returnUserJson($user),
        ], $this->successStatus);
    }

    /**
     * update
     *
     * @param  mixed $request
     * @return void
     */
    public function update(UpdateProfileRequest $request)
    {
        if ($request->user()) {
            $request->merge(['id' => $request->user()->id]);
            $user = $this->userRepository->updateUser($request->all());
            return response()->json([
                'success' => true,
                "data" => $this->userRepository->returnUserJson($user),
                'message' => "Profile updated successfully.",
            ], $this->successStatus);
        }

        return response()->json([
            'success' => false,
            'message' => "Some error occurred please try again.",
        ], $this->successStatus);
    }

    /**
     * discard
     *
     * @param  mixed $request
     * @return void
     */
    public function discard(Request $request)
    {
        if ($request->user()) {
            $request->merge(['id' => $request->user()->id]);
            $user = $this->userRepository->discardEmail($request->all());

            return response()->json([
                'success' => true,
                "data" => $this->userRepository->returnUserJson($user),
                'message' => "Discard successfully.",
            ], $this->successStatus);
        }

        return response()->json([
            'success' => false,
            'message' => "Some error occurred please try again.",
        ], $this->successStatus);
    }

     /**
     * resendVerificationEmail
     *
     * @param  mixed $request
     * @return void
     */
    public function resendVerificationEmail(Request $request)
    {
        if ($request->user()) {
            $request->merge(['id' => $request->user()->id]);
            $user = $this->userRepository->resendVerificationEmail($request->all());

            return response()->json([
                'success' => true,
                'message' => "Email resent successfully.",
            ], $this->successStatus);
        }

        return response()->json([
            'success' => false,
            'message' => "Some error occurred please try again.",
        ], $this->successStatus);
    }

    /**
     * updateEmail
     *
     * @param  mixed $request
     * @param  mixed $id
     * @param  mixed $token
     * @return void
     */
    public function updateEmail(Request $request, $id, $token)
    {
        $request->merge(['id' => $id, 'token' => $token]);

        $this->userRepository->updateEmail($request->all());

        return redirect(config('app.next_user_app_url').'/user/account/detail');
    }

    /**
     * removeAvatar
     *
     * @param  mixed $request
     * @return void
     */
    public function removeAvatar(Request $request)
    {
        if ($request->user()) {
            $request->merge(['id' => $request->user()->id]);

            $user = $this->userRepository->removeAvatar($request->all());

            return response()->json([
                'success' => true,
                "data" => $this->userRepository->returnUserJson($user),
                'message' => "Profile image remove successfully.",
            ], $this->successStatus);
        }

        return response()->json([
            'success' => false,
            'message' => "Some error occurred please try again.",
        ], $this->successStatus);
    }

    /**
     * connectAccount
     *
     * @param  mixed $request
     * @return void
     */
    public function connectAccount(Request $request)
    {
        if ($request->user()) {
            $request->merge(['id' => $request->user()->id]);

            $user = $this->userRepository->connectAccount($request->all());

            return response()->json([
                'success' => true,
                "data" => $this->userRepository->returnUserJson($user),
                'message' => "Account connected.",
            ], $this->successStatus);
        }

        return response()->json([
            'success' => false,
            'message' => "Some error occurred please try again.",
        ], $this->successStatus);
    }

    /**
     * disconnectAccount
     *
     * @param  mixed $request
     * @return void
     */
    public function disconnectAccount(Request $request)
    {
        if ($request->user()) {
            $request->merge(['id' => $request->user()->id]);

            $user = $this->userRepository->disconnectAccount($request->all());

            return response()->json([
                'success' => true,
                "data" => $this->userRepository->returnUserJson($user),
                'message' => "Account disconnected.",
            ], $this->successStatus);
        }

        return response()->json([
            'success' => false,
            'message' => "Some error occurred please try again.",
        ], $this->successStatus);
    }

    /**
     * updateAutoRecharge
     *
     * @param  mixed $request
     * @return void
     */
    public function updateAutoRecharge(Request $request)
    {
        if ($request->user()) {
            $request->merge(['id' => $request->user()->id]);
            $user = $this->userRepository->updateAutoRecharge($request->all());
            return response()->json([
                'success' => true,
                "data" => $this->userRepository->returnUserJson($user),
                'message' => "Auto recharge updated successfully.",
            ], $this->successStatus);
        }

        return response()->json([
            'success' => false,
            'message' => "Some error occurred please try again.",
        ], $this->successStatus);
    }
}
