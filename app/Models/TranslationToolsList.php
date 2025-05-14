<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TranslationToolsList extends Model
{
    protected $fillable = ['name'];

    public function translationTools(): HasMany
    {
        return $this->hasMany(TranslationTool::class);
    }
}
