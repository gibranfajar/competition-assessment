<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Member;
use App\Models\Race;
use App\Models\Score;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{

    private function convertTimeToSeconds($time)
    {
        if (!$time || !preg_match('/^\d{2}:\d{2}\.\d{2}$/', $time)) {
            return 0;
        }

        [$minutes, $rest] = explode(':', $time);
        [$seconds, $hundredths] = explode('.', $rest);

        return ((int)$minutes * 60) + (int)$seconds + ((int)$hundredths / 100);
    }

    private function convertSecondsToFormattedTime($totalSeconds)
    {
        $minutes = floor($totalSeconds / 60);
        $seconds = floor($totalSeconds % 60);
        $hundredths = round(($totalSeconds - floor($totalSeconds)) * 100);

        return sprintf('%02d:%02d.%02d', $minutes, $seconds, $hundredths);
    }

    public function index()
    {
        $admins = User::where('role', 'admin')->orderBy('created_at', 'desc')->get();
        $cities = City::orderBy('created_at', 'desc')->get();
        return Inertia::render('admins', [
            'admins' => $admins,
            'cities' => $cities
        ]);
    }

    public function superadmin()
    {
        $scores = Score::with(['member.city', 'race'])->get();
        $races = Race::all();
        $cities = City::all();

        $bestTimePerRace = $races->map(function ($race) use ($scores) {
            // Filter skor hanya untuk race ini
            $filtered = $scores->filter(fn($score) => $score->race_id === $race->id);

            // Urutkan berdasarkan waktu (dalam detik)
            $bestScore = $filtered->sortBy(function ($score) {
                return $this->convertTimeToSeconds($score->time);
            })->first();

            return [
                'raceName' => $race->name,
                'time' => $bestScore?->time,
                'member' => $bestScore?->member,
                'city' => $bestScore?->member?->city?->name,
            ];
        });

        return Inertia::render('dashboard', [
            'scores' => $scores,
            'races' => $races,
            'cities' => $cities,
            'bestTimePerRace' => $bestTimePerRace
        ]);
    }


    public function dashboard()
    {
        $races = Race::all();
        $city = City::where('name', Auth::user()->username)->firstOrFail();

        $scores = Score::with(['member.city', 'race'])
            ->whereHas('member', function ($query) use ($city) {
                $query->where('city_id', $city->id);
            })
            ->get();

        // Transform jadi groupedByMember
        $grouped = [];

        foreach ($scores as $score) {
            $memberId = $score->member_id;
            $raceCode = $score->race->code;
            $time = $score->time;

            if (!isset($grouped[$memberId])) {
                $grouped[$memberId] = [
                    'member' => $score->member,
                    'scores' => [],
                ];
            }

            $grouped[$memberId]['scores'][$raceCode] = $time;
        }

        $bestTimePerRace = $races->map(function ($race) use ($scores) {
            // Filter skor hanya untuk race ini
            $filtered = $scores->filter(fn($score) => $score->race_id === $race->id);

            // Urutkan berdasarkan waktu (dalam detik)
            $bestScore = $filtered->sortBy(function ($score) {
                return $this->convertTimeToSeconds($score->time);
            })->first();

            return [
                'raceName' => $race->name,
                'time' => $bestScore?->time,
                'member' => $bestScore?->member,
                'city' => $bestScore?->member?->city?->name,
            ];
        });

        $members = Member::where('city_id', $city->id)->get();


        $admin = User::where('id', Auth::user()->id)->first();

        return Inertia::render('dashboard-admin', [
            'scores' => $scores,
            'races' => $races,
            'city' => $city,
            'members' => $members,
            'admins' => $admin,
            'grouped' => $grouped,
            'bestTimePerRace' => $bestTimePerRace
        ]);
    }


    public function store(Request $request)
    {
        try {
            User::create([
                'name' => $request->username,
                'username' => $request->username,
                'email' => $request->username . '@gmail.com',
                'password' => Hash::make($request->password),
            ]);

            return redirect()->back();
        } catch (\Throwable $th) {
            return redirect()->back()->withErrors($th->getMessage());
        }
    }

    public function update(Request $request, User $admin)
    {
        try {
            $admin->update([
                'username' => $request->username,
                'name' => $request->username,
                'email' => $request->username . '@gmail.com',
                'password' => $request->password ? Hash::make($request->password) : $admin->password,
            ]);

            return redirect()->back();
        } catch (\Throwable $th) {
            return redirect()->back()->withErrors($th->getMessage());
        }
    }

    public function destroy(User $admin)
    {
        try {
            User::where('id', $admin->id)->delete();
            return redirect()->back();
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', $th->getMessage());
        }
    }

    public function logout(Request $request)
    {
        $user = Auth::user();
        $user->decrement('count_access');
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
