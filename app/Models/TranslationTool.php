<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TranslationTool extends Model
{
    protected $fillable = ['user_id', 'translation_tool_id'];

    public function translationToolsList(): BelongsTo
    {
        return $this->belongsTo(TranslationToolsList::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
