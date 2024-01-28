<?php

namespace App\Logging;

use Monolog\Logger;
use Logtail\Monolog\LogtailHandler;

class LogTailLogger
{
    /**
      * Create a custom Monolog instance.
      *
      * @param  array  $config
      * @return \Monolog\Logger
      */
    public function __invoke(array $config)
    {
        $logger = new Logger("logtail-source");
        $logger->pushHandler(new LogtailHandler(config('logging.channels.logtail.api_key')));
        return $logger;
    }
}
