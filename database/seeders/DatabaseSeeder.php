<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $data = [
            "Jakarta",
            "Makassar",
            "Balikpapan",
            "Bandung",
            "Surabaya",
            "Semarang",
            "Medan",
            "Palembang",
            "Bali",
            "Pekanbaru",
        ];
        foreach ($data as $value) {
            DB::table('cities')->insert([
                'name' => $value,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
