<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LanguagePairsRate extends Model
{

    protected $fillable = [
        'user_id',
        'source_language_id',
        'target_language_id',
        'service_id',
        'proposed_rate',
        'final_rate',
        'machine_translation_experience',
        'approved_by',
        'approval_reference_email',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sourceLanguage(): BelongsTo
    {
        return $this->belongsTo(Language::class, 'source_language_id');
    }

    public function targetLanguage(): BelongsTo
    {
        return $this->belongsTo(Language::class, 'target_language_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function languagePairsRateHistory(): HasMany
    {
        return $this->hasMany(LanguagePairsRateHistory::class, 'language_pair_id');
    }
}
