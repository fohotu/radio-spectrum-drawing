<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RadioSpectrumController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard1', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard/Index');
});

Route::get('/radiospectrum1', function () {
    return Inertia::render('Radiospectrum/Main');
});

Route::get('/radiospectrum', [RadioSpectrumController::class, 'index'])->name('radiospectrum.index');
Route::get('/radiospectrum/create', [RadioSpectrumController::class, 'create'])->name('radiospectrum.create');
Route::post('/radiospectrum/copy', [RadioSpectrumController::class, 'copy'])->name('radiospectrum.copy');
Route::post('/radiospectrum/save', [RadioSpectrumController::class, 'store'])->name('radiospectrum.save');

Route::get('/radiospectrum/{id}/edit', [RadioSpectrumController::class, 'edit'])->name('radiospectrum.edit');
Route::post('/radiospectrum/update/{id}', [RadioSpectrumController::class, 'update'])->name('radiospectrum.update');
// routes/web.php

Route::delete('/radiospectrum/{id}', [RadioSpectrumController::class, 'destroy'])
    ->name('radiospectrum.destroy');

require __DIR__.'/auth.php';
