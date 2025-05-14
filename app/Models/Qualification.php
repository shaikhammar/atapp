<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Qualification extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'name',
        'institution',
        'country',
        'city',
        'issued_date',
        'expiry_date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
