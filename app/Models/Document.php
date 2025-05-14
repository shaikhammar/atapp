<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    protected $fillable = ['user_id', 'name', 'file_path', 'type'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
