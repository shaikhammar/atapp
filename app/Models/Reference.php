<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reference extends Model
{
    protected $fillable = [
        'user_id',
        'comapny_name',
        'contact_name',
        'contact_email'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
