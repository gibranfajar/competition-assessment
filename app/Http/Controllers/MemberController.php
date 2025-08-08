<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cities = City::orderBy('created_at', 'desc')->get();
        $members = Member::with('city')->orderBy('created_at', 'desc')->get();
        return Inertia::render('members', [
            'members' => $members,
            'cities' => $cities
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
            // Validasi sederhana
            $request->validate([
                'number_member' => 'required|string',
                'city_id' => 'required|string',
            ]);

            // Cek duplikat
            $exists = Member::where('number_member', $request->number_member)
                ->where('city_id', $request->city_id)
                ->exists();

            if ($exists) {
                return redirect()->back()->withErrors([
                    'number_member' => 'Nomor member sudah ada di kota ini'
                ]);
            }

            // Simpan jika tidak ada duplikat
            Member::create($request->all());

            return redirect()->back()->with('message', 'Data berhasil disimpan!');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', $th->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Member $member)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Member $member)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Member $member)
    {
        try {
            $member->update($request->all());
            return redirect()->back();
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', $th->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Member $member)
    {
        try {
            $member->delete();
            return redirect()->back();
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', $th->getMessage());
        }
    }
}
