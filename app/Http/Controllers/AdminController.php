<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\City;
use App\Models\Member;
use App\Models\Race;
use App\Models\Score;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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

        return Inertia::render('dashboard', [
            'scores' => $scores,
            'races' => $races,
            'cities' => $cities
        ]);
    }

    public function dashboard()
    {
        $city = City::where('name', Auth::user()->username)->firstOrFail();

        $scores = Score::with(['member.city', 'race'])
            ->whereHas('member', function ($query) use ($city) {
                $query->where('city_id', $city->id);
            })
            ->get();

        $members = Member::where('city_id', $city->id)->get();

        $races = Race::all();

        return Inertia::render('dashboard-admin', [
            'scores' => $scores,
            'races' => $races,
            'city' => $city,
            'members' => $members
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Admin::create([
            //     'city_id' => intval($request->city_id),
            //     'password' => bcrypt($request->password),
            // ]);

            User::create([
                'name' => $request->username,
                'username' => $request->username,
                'email' => $request->username . '@gmail.com',
                'password' => Hash::make($request->password),
            ]);

            return redirect()->back();
        } catch (\Throwable $th) {
            dd($th);
            return redirect()->back()->with('error', $th->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Admin $admin)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Admin $admin)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Admin $admin)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $admin)
    {
        try {
            User::where('id', $admin->id)->delete();
            return redirect()->back();
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', $th->getMessage());
        }
    }
}
