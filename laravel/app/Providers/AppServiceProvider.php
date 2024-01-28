<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use Illuminate\Support\Facades\Storage;

use League\Flysystem\Filesystem;

use PlatformCommunity\Flysystem\BunnyCDN\BunnyCDNAdapter;

use BunnyCDN\Storage\BunnyCDNStorage;

use Laravel\Cashier\Cashier;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        Cashier::ignoreMigrations();
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Storage::extend('bunnycdn', function ($app, $config) {
            $client = new BunnyCDNAdapter(
                new BunnyCDNStorage(
                    $config['storage_zone'],
                    $config['api_key'],
                    $config['region']
                ),
                'https://cdn.system.io' # Pull Zone URL (optional)
            );

            return new Filesystem($client);
        });
    }
}
