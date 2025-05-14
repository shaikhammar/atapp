<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'role:linguist'])->group(function () {
    Route::get('profile', function () {
        return Inertia::render('linguist/profile');
    })->name('linguist');

    Route::get('linguist/edit', function () {
        return Inertia::render('linguist/edit');
    })->name('profile.edit');
});
