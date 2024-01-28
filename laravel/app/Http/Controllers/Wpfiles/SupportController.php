<?php

namespace App\Http\Controllers\system;

use App\Repositories\WebsiteRepository;

use App\Repositories\SupportRepository;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Http\Controllers\system\Requests\ContactRequest;

class SupportController extends Controller
{
    public $successStatus = 200;

    protected $supportRepository;

    /**
     * __construct
     *
     * @param  mixed $supportRepository
     * @return void
     */
    public function __construct(SupportRepository $supportRepository)
    {
        $this->supportRepository = $supportRepository;
    }

    /**
     * submitContactRequest
     *
     * @param  mixed $request
     * @return void
     */
    public function submitContactRequest(ContactRequest $request)
    {
        $response = $this->supportRepository->submitContactRequest($request->all());

        return response()->json($response, $this->successStatus);
    }

    /**
     * searchArticles
     *
     * @param  mixed $request
     * @return void
     */
    public function searchArticles(Request $request)
    {
        $response = $this->supportRepository->searchArticles($request->all());

        return response()->json($response, $this->successStatus);
    }
}
