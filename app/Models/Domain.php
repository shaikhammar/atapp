<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Domain extends Model
{
    protected $fillable = [
        'name',
        'parent_id',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Domain::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Domain::class, 'parent_id');
    }

    public function expertises(): HasMany
    {
        return $this->hasMany(Expertise::class);
    }
}
