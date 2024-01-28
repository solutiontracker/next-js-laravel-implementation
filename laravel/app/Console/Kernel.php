<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    //Bugsnag can increase the PHP memory limit when your app runs out of memory to ensure events can be delivered. To do this, a “bootstrapper” class must be registered with the kernel. This class will be called before the application is booted, and can be used to increase the memory limit before the application is booted.
    protected function bootstrappers()
    {
        return array_merge(
            [\Bugsnag\BugsnagLaravel\OomBootstrapper::class],
            parent::bootstrappers(),
        );
    }

    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        Commands\BunnyCdn\OriginList::class,
        Commands\BunnyCdn\UpdateWebsiteZoneStats::class,
        Commands\BunnyCdn\UpdateCdnUserStat::class,
        Commands\Payments\AutoRecharge::class,
        Commands\Payments\RechargeBalanceNotification::class,
        Commands\Accounts\DeactivateCdn::class,
        Commands\Website\CleanWebsite::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        //BunnyCdn Fetch/Update origin list
        $schedule->command('bunny:origin_list')
            ->everySixHours()
            ->onOneServer();

        //BunnyCdn Update stats
        $schedule->command('bunny:update_website_zone_stats')
            ->everyThirtyMinutes()
            ->onOneServer();

        //User cdn usage calculation
        $schedule->command('bunny:update_cdn_user_stat')
            ->everyThirtyMinutes()
            ->onOneServer();

        //Auto recharge
        $schedule->command('payments:auto-recharge-balance')
            ->everyFifteenMinutes()
            ->onOneServer();

        //Recharge balance notification
        $schedule->command('payments:recharge-balance-notification')
            ->everyFifteenMinutes()
            ->onOneServer();

        //Deactivate cdn
        $schedule->command('accounts:deactivate-cdn')
            ->everyThreeMinutes()
            ->onOneServer();

        //Clean websites
        $schedule->command('websites:clean')
            ->daily()
            ->onOneServer();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
