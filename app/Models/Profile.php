<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Profile extends Model
{

    use HasFactory;

    protected $fillable = [
        'user_id',
        'is_individual',
        'first_name',
        'last_name',
        'company_name',
        'phone_number',
        'date_of_birth',
        'preferred_currency_id',
        'is_translator',
        'is_interpreter',
        'avatar',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function address(): MorphOne
    {
        return $this->morphOne(Address::class, 'addressable');
    }

    public function languages(): BelongsToMany
    {
        return $this->belongsToMany(Language::class, 'language_profile');
    }

    public function preferredCurrency(): BelongsTo
    {
        return $this->belongsTo(Currency::class, 'preferred_currency_id');
    }


    public function isComplete(): bool
    {

        return $this->is_individual &&
            $this->first_name &&
            $this->last_name &&
            $this->date_of_birth &&
            $this->phone_number &&
            $this->preferred_currency_id &&
            $this->address()->exists() &&
            $this->languages()->exists() &&
            $this->is_translator &&
            $this->is_interpreter &&
            $this->languages()->count() >= 1;
    }
}
