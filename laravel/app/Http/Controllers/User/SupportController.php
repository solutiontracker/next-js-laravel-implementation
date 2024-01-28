<?php

namespace App\Http\Controllers\User;

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
     * createTicket
     *
     * @param  mixed $request
     * @return void
     */
    public function createTicket(Request $request)
    {
        $request->merge(['email' => $request->user()->email, 'name' => $request->user()->first_name.' '.$request->user()->last_name]);

        $response = $this->supportRepository->createTicket($request->all());

        return response()->json($response, $this->successStatus);
    }
}
