<?php

namespace App\Http\Controllers\system;

use App\Http\Controllers\Controller;

use App\Repositories\PlanRepository;

use Illuminate\Http\Request;

class ManageSubscriptionController extends Controller
{
    public $successStatus = 200;

    protected $planRepository;

    /**
     * __construct
     *
     * @param  mixed $planRepository
     * @return void
     */
    public function __construct(PlanRepository $planRepository)
    {
        $this->planRepository = $planRepository;
    }

    /**
     * getTrialDays
     * @param  mixed $request
     * @return void
     */
    public function getTrialDays(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => array(
                'trial_days' => PlanRepository::getTrialsDays()
            )
        ], $this->successStatus);
    }
}
