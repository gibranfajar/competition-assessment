<?php

namespace App\Http\Controllers;

use App\Models\Score;
use Illuminate\Http\Request;

class ScoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        // Convert MM:SS:ms ke milidetik
        $parts = explode(':', $request->time);
        $minutes = (int) $parts[0];
        $seconds = (int) $parts[1];
        $milliseconds = (int) $parts[2];

        $totalMilliseconds = ($minutes * 60 * 1000) + ($seconds * 1000) + $milliseconds;

        try {
            Score::create([
                'city_id' => $request->city_id,
                'member_id' => $request->member_id,
                'race_id' => $request->race_id,
                'time' => $totalMilliseconds
            ]);
            return redirect()->back();
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', $th->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Score $score)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Score $score)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Score $score)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Score $score)
    {
        //
    }

    public function addPoint(Request $request)
    {

        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'field' => 'required|in:pePoin,acePoin,dDayPoin',
            'value' => 'required|numeric',
        ]);

        $fieldMap = [
            'pePoin' => 'pe_point',
            'acePoin' => 'ace_point',
            'dDayPoin' => 'dday_point',
        ];

        $field = $fieldMap[$validated['field']] ?? null;

        if (!$field) {
            return response()->json(['message' => 'Invalid field.'], 400);
        }

        // Ambil semua score milik member dan update field
        Score::where('member_id', $validated['member_id'])->update([
            $field => $validated['value'],
        ]);

        return back()->with('success', 'Poin berhasil ditambahkan.');
    }
}
