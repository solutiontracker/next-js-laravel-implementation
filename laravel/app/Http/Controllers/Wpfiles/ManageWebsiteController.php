<?php

namespace App\Http\Controllers\system;

use App\Repositories\WebsiteRepository;

use App\Repositories\CdnRepository;

use App\Repositories\PlanRepository;

use App\Repositories\UserRepository;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Http\Controllers\User\Requests\Website\WebsiteRequest;
class ManageWebsiteController extends Controller
{
    public $successStatus = 200;

    protected $websiteRepository;

    protected $cdnRepository;

    protected $planRepository;

    /**
     * __construct
     *
     * @param  mixed $websiteRepository
     * @param  mixed $cdnRepository
     * @param  mixed $planRepository
     * @return void
     */
    public function __construct(WebsiteRepository $websiteRepository, CdnRepository $cdnRepository, PlanRepository $planRepository)
    {
        $this->websiteRepository = $websiteRepository;
        $this->cdnRepository = $cdnRepository;
        $this->planRepository = $planRepository;
    }

    /**
     * purgeZone
     *
     * @param  mixed $request
     * @return void
     */
    public function purgeZone(Request $request)
    {
        $response = $this->websiteRepository->purgeZone($request->all());

        return response()->json($response, $this->successStatus);
    }

    /**
     * downloadPlugin
     *
     * @param  mixed $request
     * @return void
     */
    public function downloadPlugin(Request $request)
    {
        $response = $this->websiteRepository->downloadPlugin($request->all());

        return response()->json($response, $this->successStatus);
    }
}
