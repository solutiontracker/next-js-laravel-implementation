<?php

namespace App\Http\Controllers\User;

use App\Repositories\PlanRepository;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

class ManagePlanController extends Controller
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
     * index
     * @param  mixed $request
     * @return void
     */
    public function index(Request $request)
    {
        $plans = $this->planRepository->getPlans($request->all());

        return response()->json([
            'success' => true,
            "data" => array(
                'plans' => $plans
            )
        ], $this->successStatus);
    }

    /**
     * getPlan
     * @param  mixed $request
     * @return void
     */
    public function getPlan(Request $request, $id)
    {
        $plan = $this->planRepository->getPlan($id);

        return response()->json([
            'success' => true,
            "data" => array(
                'plan' => $plan
            )
        ], $this->successStatus);
    }
}
