<?php

namespace App\Http\Controllers\system;

use App\Repositories\UserRepository;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

class GrooveHqController extends Controller
{
    public $successStatus = 200;

    protected $userRepository;

    /**
     * __construct
     *
     * @param  mixed $userRepository
     * @return void
     */
    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * profile
     *
     * @param  mixed $request
     * @return void
     */
    public function profile(Request $request)
    {
        $response = $this->userRepository->getGrooveHqProfile($request->all());

        return response()->json($response, $this->successStatus);
    }
}
