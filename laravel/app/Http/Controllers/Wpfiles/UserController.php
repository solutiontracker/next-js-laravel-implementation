<?php

namespace App\Http\Controllers\system;

use App\Repositories\UserRepository;

use App\Repositories\UsageTrackingRepository;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Http\Controllers\system\Requests\NewsletterRequest;

use App\Http\Controllers\system\Requests\FeedbackRequest;

class UserController extends Controller
{
    public $successStatus = 200;

    protected $userRepository;

    protected $usage_tracking_Repository;

    /**
     * @param UserRepository $userRepository
     */
    public function __construct(UserRepository $userRepository, UsageTrackingRepository $usage_tracking_Repository)
    {
        $this->userRepository = $userRepository;
        $this->usage_tracking_Repository = $usage_tracking_Repository;
    }

    /**
     * fetchStatus
     *
     * @param  mixed $request
     * @return void
     */
    public function fetchStatus(Request $request)
    {
        $response = $this->userRepository->fetchStatus($request->all());

        return response()->json($response, $response['status_code']);
    }

    /**
     * addNewsletterEmail
     *
     * @param  mixed $request
     * @return void
     */
    public function addNewsletterEmail(NewsletterRequest $request)
    {
        $response = $this->userRepository->addNewsletterEmail($request->all());

        return response()->json([
            'success' => true,
            'message' => "Email added successfully",
            "data" => array(
                'id' => $response->id
            )
        ], $this->successStatus);
    }

    /**
     * addNewsletterEmail
     *
     * @param  mixed $request
     * @return void
     */
    public function verifyNewsletterEmail(Request $request, $id, $token)
    {
        $newsletter = $this->userRepository->verifyNewsletterEmail($id, $token);

        if($newsletter->redirect) {
            if($newsletter->status) {
                return redirect($newsletter->redirect.'?page=system&subscribe=1');
            } else {
                return redirect($newsletter->redirect.'?page=system');
            }
        } else {
            return redirect(config('app.next_user_app_url'));
        }
    }

    /**
     * feedback
     *
     * @param  mixed $request
     * @return void
     */
    public function feedback(FeedbackRequest $request)
    {
        $response = $this->userRepository->feedback($request->all());

        return response()->json([
            'success' => true,
            'message' => "Feedback submit successfully",
            "data" => array(
                'id' => $response->id
            )
        ], $this->successStatus);
    }

    /**
     * saveUsageTracking
     *
     * @param  mixed $request
     * @return void
     */
    public function saveUsageTracking(Request $request)
    {
        $this->usage_tracking_Repository->store($request->data, getDomain($request->domain));

        return response()->json([
            'success' => true,
            'message' => "Usage tracking save successfully"
        ], $this->successStatus);
    }
}
