<?php

namespace App\Console\Commands;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class UpdateExpiredSessions extends Command
{
    protected $signature = 'session:update-expired';
    protected $description = 'Update count_access untuk user dari session yang expired';

    public function handle()
    {
        // Lifetime session dalam menit
        $lifetime = Config::get('session.lifetime', 1);

        // Timestamp batas expired
        $expiredTimestamp = Carbon::now()->subMinutes($lifetime)->timestamp;

        // Ambil semua session yang expired
        $expiredSessions = DB::table('sessions')
            ->where('last_activity', '<=', $expiredTimestamp)
            ->get();

        foreach ($expiredSessions as $session) {
            if ($session->user_id) {
                // Update count_access user
                DB::table('users')
                    ->where('id', $session->user_id)
                    ->decrement('count_access');
            }

            // Hapus session
            DB::table('sessions')->where('id', $session->id)->delete();

            $this->info("Session {$session->id} expired, count_access updated for user {$session->user_id}");
        }

        $this->info('Expired session check completed!');
    }
}
