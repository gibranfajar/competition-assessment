<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\RaceController;
use App\Http\Controllers\ScoreController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // auth admin superadmin
    Route::get('dashboard', [AdminController::class, 'superadmin'])->name('dashboard');
    Route::resource('admins', AdminController::class);

    // lomba / races
    Route::resource('races', RaceController::class);

    // members / anggota
    Route::resource('members', MemberController::class);

    Route::post('/add-point', [ScoreController::class, 'addPoint'])->name('scores.add-point');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admins.dashboard');
    Route::post('/admin-logout', [AdminController::class, 'logout'])->name('admins.logout');
    Route::resource('scores', ScoreController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
