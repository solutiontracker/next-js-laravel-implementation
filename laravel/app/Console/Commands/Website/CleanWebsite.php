<?php

namespace App\Console\Commands\Website;

use Illuminate\Console\Command;

class CleanWebsite extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'websites:clean';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean websites';

    /**
     * __construct
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $websites = \App\Models\Website::where('cdn_status', 'pending')->get();

        foreach($websites as $website) {
            $website->delete();
        }

        $this->info('Cleaned successfully');
    }
}
