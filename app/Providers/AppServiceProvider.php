<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use App\Http\Resources\AuthUserResource;
use App\Models\LanguagePairsRate;
use App\Observers\LanguagePairsRateObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Model::automaticallyEagerLoadRelationships();
        AuthUserResource::withoutWrapping();
        LanguagePairsRate::observe(LanguagePairsRateObserver::class);
    }
}
