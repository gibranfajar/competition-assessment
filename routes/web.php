<?php

use App\Http\Controllers\MemberController;
use App\Http\Controllers\RaceController;
use App\Http\Controllers\ScoreController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // auth admin superadmin
    Route::get('dashboard', [UserController::class, 'superadmin'])->name('dashboard');
    Route::get('/admins', [UserController::class, 'index'])->name('admins.index');
    Route::post('/admins', [UserController::class, 'store'])->name('admins.store');
    Route::put('/admins/{admin}', [UserController::class, 'update'])->name('admins.update');
    Route::delete('/admins/{admin}', [UserController::class, 'destroy'])->name('admins.destroy');



    // lomba / races
    Route::resource('races', RaceController::class);

    // members / anggota
    Route::resource('members', MemberController::class);

    Route::post('/add-point', [ScoreController::class, 'addPoint'])->name('scores.add-point');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/admin/dashboard', [UserController::class, 'dashboard'])->name('admins.dashboard');
    Route::post('/admin-logout', [UserController::class, 'logout'])->name('admins.logout');
    Route::resource('scores', ScoreController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
