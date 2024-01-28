<?php

namespace App\Http\Controllers\User;

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
     * index
     *
     * @param  mixed $request
     * @return void
     */
    public function index(Request $request, $page = 1)
    {
        $request->merge(['page' => $page]);

        $websites = $this->websiteRepository->listing($request->all());

        $free = $this->websiteRepository->getTotalWebsite(['type' => 'free']);

        $pro = $this->websiteRepository->getTotalWebsite(['type' => 'pro']);

        $total = $this->websiteRepository->getTotalWebsite();

        return response()->json([
            'success' => true,
            'data' => array(
                "websites" => $websites,
                "free" => $free,
                "pro" => $pro,
                "total" => $total
            )
        ], $this->successStatus);
    }

    /**
     * index
     *
     * @param  mixed $request
     * @return void
     */
    public function store(WebsiteRequest $request)
    {
        $subscription = UserRepository::getActiveSubscription($request->user());

        $request->merge(['type' => $request->user()->is_free == 0 && $subscription && $request->type == "pro" ? 'pro' : 'free']);

        if(!$subscription || ($subscription && !$subscription->hasIncompletePayment())) {
            $response = $this->websiteRepository->store($request->all());
            return response()->json($response, $this->successStatus);
        } else {
            return response()->json([
                'success' => false,
                'message' => "You have some incomplete payments, please confirm your payments."
            ], $this->successStatus);
        }

    }

    /**
     * update
     *
     * @param  mixed $request
     * @param  mixed $id
     * @return void
     */
    public function update(WebsiteRequest $request, $id)
    {
        $response = $this->websiteRepository->_update($request->all(), $id);

        return response()->json($response, $this->successStatus);
    }

    /**
     * destroy
     *
     * @param  mixed $request
     * @param  mixed $id
     * @return void
     */
    public function destroy(WebsiteRequest $request, $id)
    {
        $this->websiteRepository->destroy($request->all(), $id);

        return response()->json([
            'success' => true,
        ], $this->successStatus);
    }

    /**
     * fetch
     *
     * @param  mixed $request
     * @param  mixed $id
     * @return void
     */
    public function fetch(Request $request, $id)
    {
        $website = $this->websiteRepository->fetch(['id' => $id]);

        return response()->json([
            'success' => true,
            "data" => [
                'website' => $website
            ]
        ], $this->successStatus);
    }

    /**
     * fetchByUrl
     *
     * @param  mixed $request
     * @param  mixed $id
     * @return void
     */
    public function fetchByUrl(Request $request)
    {
        $website = $this->websiteRepository->fetchByUrl(['url' => $request->url]);

        return response()->json([
            'success' => true,
            "data" => [
                'website' => $website
            ]
        ], $this->successStatus);
    }

    /**
     * cdnStats
     *
     * @param  mixed $request
     * @return void
     */
    public function cdnStats(Request $request)
    {
        $request->merge(['user_id' => $request->user()->id, 'type' => 'pro']);

        $dates = $this->cdnRepository->getStatsDatesForFilter($request->all());

        if(!$request->date) {
            $request->merge(['date' => count($dates) > 0 ? $dates[0]['value'] : \Carbon\Carbon::now()->subDays(30)->toDateString().'|match']);
        }

        $stats = $this->cdnRepository->getStats($request->all());

        $stats['websites'] = $this->websiteRepository->listing($request->all(), false);

        return response()->json([
            'success' => true,
            'data' => array(
                'stats' => $stats,
                'dates' => $dates
            )
        ], $this->successStatus);
    }

    /**
     * downloadPlugin
     * @param  mixed $request
     * @return void
     */
    public function downloadPlugin(Request $request)
    {
        $user = user();

        $version = config('settings.current_version');

        $subscription = UserRepository::getActiveSubscription($user);

        //If user is pro
        if($user->is_free == 0 && $subscription) {
            $downloadUrl = (string) $this->cdnRepository->authenticate_cdn_url('/system-Pro-'.$version.'.zip');
        } else {
            $downloadUrl = '';
        }

        return response()->json([
            'success' => true,
            'data' => array(
                'downloadUrl' => $downloadUrl
            )
        ], $this->successStatus);
    }

}
