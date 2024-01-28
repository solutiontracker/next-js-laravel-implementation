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

class CreateZone implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

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
        $user_id = $this->request['user_id'];
        $website_id = $this->request['website_id'];
        $website = \App\Models\Website::where('id', $website_id)->where('user_id', $user_id)->first();
        if($website) {
            //First step
            if($website->step == 0) {
                $zone = $this->cdnRepository->createZone(['user_id' => $website->user_id, 'volume' => $website->volume, 'url' => $website->url]);
                if($zone['success']) {
                    $website->step = 1;
                    $website->cdn_hostname = $zone['response']['Hostnames'][0]['Value'];
                    $website->zone_identifier = $zone['response']['Id'];
                    $website->cdn_domain_id = $zone['zone_id'];
                    $website->save();
                } else {
                    $this->release(120);
                }
                //2nd step
                if($website->step == 1) {
                    //Create DNS
                    $dns = $this->cdnRepository->createDNS(['zone_id' => $website->cdn_domain_id, 'hostname' => $website->cdn_hostname]);
                    if($dns['success']) {
                        $website->step = 2;
                        $website->cname_identifier = $dns['response']['domain_record']['id'];
                        $website->save();
                    } else {
                        $this->release(120);
                    }
                }
                //3rd step
                if($website->step == 2) {
                    $hostname = $this->cdnRepository->addHostName(['id' => $website->zone_identifier, 'hostname' => str_replace("{id}", $website->cdn_domain_id, config('services.bunnycdn.endpoint_url'))]);
                    if($hostname['success']) {
                        $website->step = 3;
                        $website->save();
                    } else {
                        $this->release(120);
                    }
                }
                //4th step
                if($website->step == 3) {
                    $rule = $this->cdnRepository->addOrUpdateEdgeRule(0, $website);
                    if($rule['success']) {
                        $website->step = 4;
                        $website->save();
                    } else {
                        $this->release(120);
                    }
                }
                //5th step
                if($website->step == 4) {
                    $rule = $this->cdnRepository->addOrUpdateEdgeRule(1, $website);
                    if($rule['success']) {
                        $website->step = 5;
                        $website->save();
                    } else {
                        $this->release(120);
                    }
                }
                //6th step
                if($website->step == 5) {
                    $rule = $this->cdnRepository->addOrUpdateEdgeRule(2, $website);
                    if($rule['success']) {
                        $website->step = 6;
                        $website->save();
                    } else {
                        $this->release(120);
                    }
                }
                //7th step
                if($website->step == 6) {
                    $rule = $this->cdnRepository->addOrUpdateEdgeRule(3, $website);
                    if($rule['success']) {
                        $website->step = 7;
                        $website->save();
                    } else {
                        $this->release(120);
                    }
                }
                //8th step
                if($website->step == 7) {
                    $rule = $this->cdnRepository->addOrUpdateEdgeRule(4, $website);
                    if($rule['success']) {
                        $website->step = 8;
                        $website->save();
                    } else {
                        $this->release(120);
                    }
                }
                //9th step
                if($website->step == 8) {
                    $ssl_certificate = $this->cdnRepository->addSSLCertificate(['zone_id' => $website->zone_identifier, 'hostname' => str_replace("{id}", $website->cdn_domain_id, config('services.bunnycdn.endpoint_url'))]);
                    if($ssl_certificate['success']) {
                        $website->step = 9;
                        $website->cdn_status = 'active';
                        $website->save();
                    } else {
                        $this->release(120);
                    }
                }

                //11 step
                //$this->cdnRepository->forceSSl(['hostname' => $website->cdn_hostname, 'zone_id' => $website->zone_identifier]);

                //12 step
                //$this->cdnRepository->forceSSl(['hostname' => str_replace("{id}", $website->cdn_domain_id, config('services.bunnycdn.endpoint_url')), 'zone_id' => $website->zone_identifier]);
            }
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
    * Calculate the number of seconds to wait before retrying the job.
    *
    * @return array
    */
    public function backoff()
    {
        return [180, 480, 960, 1800, 3600, 7200, 14400, 28800, 57600,  115200];
    }

    /**
     * retryUntil
     *
     * @return void
     */
    public function retryUntil()
    {
        // will keep retrying, by backoff logic below
        // until 1 day from first run.
        // After that, if it fails it will go
        // to the failed_jobs table
        return now()->addDay();
    }
}
