<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Language extends Model
{

    use HasFactory;

    protected $fillable = ['name', 'iso_code'];

    public function profiles(): BelongsToMany
    {
        return $this->belongsToMany(Profile::class, 'language_profile');
    }

    public function languagePairsRatesSource(): HasMany
    {
        return $this->hasMany(LanguagePairsRate::class, 'source_language_id');
    }

    public function languagePairsRatesTarget(): HasMany
    {
        return $this->hasMany(LanguagePairsRate::class, 'target_language_id');
    }
}
