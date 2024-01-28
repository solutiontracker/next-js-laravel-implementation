<?php

namespace App\Jobs\Bunny;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Repositories\CdnRepository;
use Throwable;
use Illuminate\Queue\Middleware\ThrottlesExceptions;
use Illuminate\Support\Facades\Notification;
use App\Notifications\Cdn\User\CdnSuspended;

class UpdateZoneRule implements ShouldQueue
{
    use Dispatchable;

    use InteractsWithQueue;

    use Queueable;

    use SerializesModels;

    protected $cdnRepository;

    public $request;

    /**
     * __construct
     *
     * @param  mixed $request
     * @return void
     */
    public function __construct($request)
    {
        $this->cdnRepository = new CdnRepository();
        $this->request = $request;
    }

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 10;

    /**
     * The maximum number of unhandled exceptions to allow before failing.
     *
     * @var int
     */
    public $maxExceptions = 10;

    /**
     * The number of seconds the job can run before timing out.
     *
     * @var int
     */
    public $timeout = 1000;

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $user = $this->request['user'];
        $websites = $this->request['websites'];
        $status = $this->request['status'];
        $notification = $this->request['notification'];
        foreach ($websites as $website) {
            $cdn = $status == "active" ? $website->cdn : 0;
            $this->cdnRepository->disableZone(['website' => $website, 'cdn' => $cdn, 'status' => $status]);
        }
        if ($notification && $status == "suspended") {
            Notification::sendNow($user, new CdnSuspended($websites));
        }
    }

    /**
     * Handle a job failure.
     *
     * @param  \Throwable  $exception
     * @return void
     */
    public function failed(Throwable $exception)
    {
        // Send user notification of failure, etc...
    }

    /**
     * Get the middleware the job should pass through.
     *
     * @return array
     */
    public function middleware()
    {
        return [(new ThrottlesExceptions(10, 5))->backoff(1)];
    }

    /**
     * The unique ID of the job.
     *
     * @return string
     */
    public function uniqueId()
    {
        return $this->request['user_id'];
    }
}
