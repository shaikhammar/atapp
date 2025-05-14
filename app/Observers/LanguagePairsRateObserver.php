<?php

namespace App\Observers;

use App\Models\LanguagePairsRate;
use App\Models\LanguagePairsRateHistory;
use Illuminate\Support\Facades\Auth;

class LanguagePairsRateObserver
{
    /**
     * Handle the LanguagePairsRate "created" event.
     */
    public function created(LanguagePairsRate $languagePairsRate): void
    {
        //
    }

    /**
     * Handle the LanguagePairsRate "updated" event.
     */
    public function updated(LanguagePairsRate $languagePairsRate): void
    {
        // Check if 'final_rate' was changed
        if ($languagePairsRate->isDirty('final_rate')) {

            // Optional: Only if final_rate is not null
            if (!is_null($languagePairsRate->final_rate)) {

                LanguagePairsRateHistory::create([
                    'language_pair_id' => $languagePairsRate->id,
                    'old_rate' => $languagePairsRate->getOriginal('final_rate'), // Old approved rate
                    'new_rate' => $languagePairsRate->final_rate,               // New approved rate
                    'changed_by' => Auth::id() ?? null, // If done by user in web UI
                    'change_type' => 'approved',
                    'notes' => 'Rate approved.',        // (Optional: You can customize)
                ]);
            }
        }
    }

    /**
     * Handle the LanguagePairsRate "deleted" event.
     */
    public function deleted(LanguagePairsRate $languagePairsRate): void
    {
        //
    }

    /**
     * Handle the LanguagePairsRate "restored" event.
     */
    public function restored(LanguagePairsRate $languagePairsRate): void
    {
        //
    }

    /**
     * Handle the LanguagePairsRate "force deleted" event.
     */
    public function forceDeleted(LanguagePairsRate $languagePairsRate): void
    {
        //
    }
}
