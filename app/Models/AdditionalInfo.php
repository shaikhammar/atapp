<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdditionalInfo extends Model
{
    protected $fillable = [
        'user_id',
        'secondary_email',
        'secondary_phone',
        'additional_fields',
    ];

    protected $casts = [
        'additional_fields' => 'array',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
