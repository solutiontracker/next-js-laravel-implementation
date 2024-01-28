<?php

namespace App\Console\Commands\BunnyCdn;

use Illuminate\Console\Command;

use App\Repositories\CdnRepository;

class OriginList extends Command
{
    protected $cdnRepository;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bunny:origin_list';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Region list';

    /**
     * __construct
     *
     * @param  mixed $cdnRepository
     * @return void
     */
    public function __construct(CdnRepository $cdnRepository)
    {
        parent::__construct();
        $this->cdnRepository = $cdnRepository;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $origins = $this->cdnRepository->fetchOriginList();

        $volumes = array('AMS', 'DE', 'FR', 'IL', 'TX', 'LA', 'MI', 'SG', 'SG2');

        if($origins['success']) {
            $origins = (array)$origins['response'];
            if(count($origins) > 0) {
                foreach($origins as $origin) {
                    $cdn_origin = \App\Models\CdnOrigin::where('region_code', $origin['RegionCode'])->where('continent_code', $origin['ContinentCode'])->where('date', \Carbon\Carbon::now()->toDateString())->where('country_code', $origin['CountryCode'])->first();
                    $premium_price_per_gigabyte = $origin['PricePerGigabyte'] + 0.03;
                    if(in_array($origin['RegionCode'], $volumes)) {
                        $volume_price_per_gigabyte = 0.02;
                    } else {
                        $volume_price_per_gigabyte = 0.00;
                    }
                    if($cdn_origin) {
                        $cdn_origin->region_code = $origin['RegionCode'];
                        $cdn_origin->continent_code = $origin['ContinentCode'];
                        $cdn_origin->country_code = $origin['CountryCode'];
                        $cdn_origin->name = $origin['Name'];
                        $cdn_origin->premium_price_per_gigabyte = $premium_price_per_gigabyte;
                        $cdn_origin->volume_price_per_gigabyte = $volume_price_per_gigabyte;
                        $cdn_origin->latitude = $origin['Latitude'];
                        $cdn_origin->longitude = $origin['Longitude'];
                        $cdn_origin->date = \Carbon\Carbon::now()->toDateString();
                        $cdn_origin->premium = 1;
                        $cdn_origin->volume = in_array($origin['RegionCode'], $volumes) ? 1 : 0;
                        $cdn_origin->save();
                    } else {
                        \App\Models\CdnOrigin::create([
                            'region_code' => $origin['RegionCode'],
                            'continent_code' => $origin['ContinentCode'],
                            'country_code' => $origin['CountryCode'],
                            'name' => $origin['Name'],
                            'premium_price_per_gigabyte' => $premium_price_per_gigabyte,
                            'volume_price_per_gigabyte' => $volume_price_per_gigabyte,
                            'latitude' => $origin['Latitude'],
                            'longitude' => $origin['Longitude'],
                            'date' => \Carbon\Carbon::now()->toDateString(),
                            'premium' => 1,
                            'volume' => in_array($origin['RegionCode'], $volumes) ? 1 : 0,
                        ]);
                    }
                }
            }
        }

        $this->info('Origin list updated successfully!');
    }
}
