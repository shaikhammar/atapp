<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LanguagePairsRateHistory extends Model
{

    protected $fillable = [
        'language_pair_id',
        'old_rate',
        'new_rate',
        'changed_by',
        'change_type',
        'notes',
    ];

    public function languagePairRate(): BelongsTo
    {
        return $this->belongsTo(LanguagePairsRate::class, 'language_pair_id');
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
