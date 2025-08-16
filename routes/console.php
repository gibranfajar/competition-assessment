<?php

use App\Console\Commands\UpdateExpiredSessions;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('session:update-expired', function () {
    $this->call(UpdateExpiredSessions::class);
})->everyMinute();
